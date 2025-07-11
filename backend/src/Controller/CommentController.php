<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Story;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/comments', name: 'api_comment_')]
class CommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('/story/{storyId}', name: 'story_comments', methods: ['GET'])]
    public function getStoryComments(int $storyId, Request $request): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)->find($storyId);

        if (!$story) {
            return $this->json(['error' => 'Histoire non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $repository = $this->entityManager->getRepository(Comment::class);
        $comments = $repository->createQueryBuilder('c')
            ->where('c.story = :story')
            ->setParameter('story', $story)
            ->orderBy('c.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        $total = $repository->createQueryBuilder('c')
            ->select('COUNT(c.id)')
            ->where('c.story = :story')
            ->setParameter('story', $story)
            ->getQuery()
            ->getSingleScalarResult();

        return $this->json([
            'comments' => $comments,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ], Response::HTTP_OK, [], ['groups' => ['comment:read']]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['storyId']) || !isset($data['content'])) {
            return $this->json(['error' => 'Story ID et contenu requis'], Response::HTTP_BAD_REQUEST);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($data['storyId']);

        if (!$story) {
            return $this->json(['error' => 'Histoire non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $comment = new Comment();
        $comment->setContent($data['content']);
        $comment->setStory($story);

        // TODO: Récupérer l'utilisateur connecté via JWT
        // $user = $this->getUser();
        // $comment->setAuthor($user);

        $errors = $this->validator->validate($comment);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($comment);
        $this->entityManager->flush();

        return $this->json($comment, Response::HTTP_CREATED, [], ['groups' => ['comment:read']]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $comment = $this->entityManager->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return $this->json(['error' => 'Commentaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // TODO: Vérifier que l'utilisateur est l'auteur du commentaire
        // if ($comment->getAuthor() !== $this->getUser()) {
        //     return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        // }

        $data = json_decode($request->getContent(), true);

        if (isset($data['content'])) {
            $comment->setContent($data['content']);
            $comment->setUpdatedAt(new \DateTimeImmutable());
        }

        $errors = $this->validator->validate($comment);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($comment, Response::HTTP_OK, [], ['groups' => ['comment:read']]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $comment = $this->entityManager->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return $this->json(['error' => 'Commentaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // TODO: Vérifier que l'utilisateur est l'auteur du commentaire ou admin
        // if ($comment->getAuthor() !== $this->getUser()) {
        //     return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        // }

        $this->entityManager->remove($comment);
        $this->entityManager->flush();

        return $this->json(['message' => 'Commentaire supprimé avec succès'], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $comment = $this->entityManager->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return $this->json(['error' => 'Commentaire non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($comment, Response::HTTP_OK, [], ['groups' => ['comment:read', 'comment:detail']]);
    }
}
