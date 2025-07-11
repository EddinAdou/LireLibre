<?php

namespace App\Controller;

use App\Entity\Story;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/stories')]
class StoryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'story_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));
        $status = $request->query->get('status', 'published');
        $search = $request->query->get('search');

        $qb = $this->entityManager->getRepository(Story::class)->createQueryBuilder('s')
            ->leftJoin('s.author', 'a')
            ->addSelect('a');

        // Filter by status
        if ($status) {
            $qb->andWhere('s.status = :status')
               ->setParameter('status', $status);
        }

        // Search functionality
        if ($search) {
            $qb->andWhere('s.title LIKE :search OR s.content LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        // Pagination
        $qb->orderBy('s.createdAt', 'DESC')
           ->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        $stories = $qb->getQuery()->getResult();

        // Get total count for pagination
        $totalQb = $this->entityManager->getRepository(Story::class)->createQueryBuilder('s')
            ->select('COUNT(s.id)');

        if ($status) {
            $totalQb->andWhere('s.status = :status')
                    ->setParameter('status', $status);
        }

        if ($search) {
            $totalQb->andWhere('s.title LIKE :search OR s.content LIKE :search')
                    ->setParameter('search', '%' . $search . '%');
        }

        $total = $totalQb->getQuery()->getSingleScalarResult();

        $serializedStories = $this->serializer->serialize(
            $stories, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'stories' => json_decode($serializedStories, true),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    #[Route('/{id}', name: 'story_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)
            ->createQueryBuilder('s')
            ->leftJoin('s.author', 'a')
            ->leftJoin('s.comments', 'c')
            ->leftJoin('c.author', 'ca')
            ->addSelect('a', 'c', 'ca')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $serializedStory = $this->serializer->serialize(
            $story, 
            'json', 
            ['groups' => ['story:read', 'comment:read']]
        );

        return new JsonResponse([
            'story' => json_decode($serializedStory, true)
        ]);
    }

    #[Route('', name: 'story_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['title'], $data['content'])) {
            return new JsonResponse([
                'error' => 'Missing required fields: title, content'
            ], Response::HTTP_BAD_REQUEST);
        }

        $story = new Story();
        $story->setTitle($data['title']);
        $story->setContent($data['content']);
        $story->setAuthor($user);
        
        // Generate slug from title
        $slug = $this->slugger->slug($data['title'])->lower();
        $story->setSlug($slug);
        
        // Set status (default to draft)
        $status = $data['status'] ?? 'draft';
        if (!in_array($status, ['draft', 'published', 'archived'])) {
            $status = 'draft';
        }
        $story->setStatus($status);

        // Validate story
        $errors = $this->validator->validate($story);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse([
                'error' => 'Validation failed',
                'details' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($story);
        $this->entityManager->flush();

        $serializedStory = $this->serializer->serialize(
            $story, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'message' => 'Story created successfully',
            'story' => json_decode($serializedStory, true)
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'story_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author
        if ($story->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'Access denied. You can only edit your own stories.'
            ], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $story->setTitle($data['title']);
            $slug = $this->slugger->slug($data['title'])->lower();
            $story->setSlug($slug);
        }

        if (isset($data['content'])) {
            $story->setContent($data['content']);
        }

        if (isset($data['status']) && in_array($data['status'], ['draft', 'published', 'archived'])) {
            $story->setStatus($data['status']);
        }

        // Validate story
        $errors = $this->validator->validate($story);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse([
                'error' => 'Validation failed',
                'details' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        $serializedStory = $this->serializer->serialize(
            $story, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'message' => 'Story updated successfully',
            'story' => json_decode($serializedStory, true)
        ]);
    }

    #[Route('/{id}', name: 'story_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author or has admin role
        if ($story->getAuthor()->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse([
                'error' => 'Access denied. You can only delete your own stories.'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($story);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Story deleted successfully'
        ]);
    }
}
