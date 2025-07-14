<?php

namespace App\Controller;

use App\Entity\Comment;
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

#[Route('/api/comments')]
class CommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('/story/{storyId}', name: 'comment_list_by_story', methods: ['GET'], requirements: ['storyId' => '\d+'])]
    public function listByStory(int $storyId, Request $request): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)->find($storyId);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));

        $qb = $this->entityManager->getRepository(Comment::class)->createQueryBuilder('c')
            ->leftJoin('c.author', 'a')
            ->addSelect('a')
            ->where('c.story = :story')
            ->setParameter('story', $story)
            ->orderBy('c.createdAt', 'ASC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $comments = $qb->getQuery()->getResult();

        // Get total count for pagination
        $total = $this->entityManager->getRepository(Comment::class)
            ->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->where('c.story = :story')
            ->setParameter('story', $story)
            ->getQuery()
            ->getSingleScalarResult();

        $serializedComments = $this->serializer->serialize(
            $comments, 
            'json', 
            ['groups' => ['comment:read']]
        );

        return new JsonResponse([
            'comments' => json_decode($serializedComments, true),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    #[Route('', name: 'comment_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['content'], $data['storyId'])) {
            return new JsonResponse([
                'error' => 'Missing required fields: content, storyId'
            ], Response::HTTP_BAD_REQUEST);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($data['storyId']);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $comment = new Comment();
        $comment->setContent($data['content']);
        $comment->setAuthor($user);
        $comment->setStory($story);

        // Validate comment
        $errors = $this->validator->validate($comment);
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

        $this->entityManager->persist($comment);
        $this->entityManager->flush();

        $serializedComment = $this->serializer->serialize(
            $comment, 
            'json', 
            ['groups' => ['comment:read']]
        );

        return new JsonResponse([
            'message' => 'Comment created successfully',
            'comment' => json_decode($serializedComment, true)
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'comment_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $comment = $this->entityManager->getRepository(Comment::class)->find($id);
        if (!$comment) {
            return new JsonResponse([
                'error' => 'Comment not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author
        if ($comment->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'Access denied. You can only edit your own comments.'
            ], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['content'])) {
            return new JsonResponse([
                'error' => 'Missing required field: content'
            ], Response::HTTP_BAD_REQUEST);
        }

        $comment->setContent($data['content']);

        // Validate comment
        $errors = $this->validator->validate($comment);
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

        $serializedComment = $this->serializer->serialize(
            $comment, 
            'json', 
            ['groups' => ['comment:read']]
        );

        return new JsonResponse([
            'message' => 'Comment updated successfully',
            'comment' => json_decode($serializedComment, true)
        ]);
    }

    #[Route('/{id}', name: 'comment_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $comment = $this->entityManager->getRepository(Comment::class)->find($id);
        if (!$comment) {
            return new JsonResponse([
                'error' => 'Comment not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author or has admin role
        if ($comment->getAuthor()->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse([
                'error' => 'Access denied. You can only delete your own comments.'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($comment);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Comment deleted successfully'
        ]);
    }
}
