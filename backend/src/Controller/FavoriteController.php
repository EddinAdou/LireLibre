<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Entity\Story;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/favorites')]
class FavoriteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'favorite_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));

        $qb = $this->entityManager->getRepository(Favorite::class)->createQueryBuilder('f')
            ->leftJoin('f.story', 's')
            ->leftJoin('s.author', 'a')
            ->addSelect('s', 'a')
            ->where('f.user = :user')
            ->setParameter('user', $user)
            ->orderBy('f.createdAt', 'DESC')
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $favorites = $qb->getQuery()->getResult();

        // Get total count for pagination
        $total = $this->entityManager->getRepository(Favorite::class)
            ->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->where('f.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        $serializedFavorites = $this->serializer->serialize(
            $favorites, 
            'json', 
            ['groups' => ['favorite:read']]
        );

        return new JsonResponse([
            'favorites' => json_decode($serializedFavorites, true),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    #[Route('/toggle', name: 'favorite_toggle', methods: ['POST'])]
    public function toggle(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['storyId'])) {
            return new JsonResponse([
                'error' => 'Missing required field: storyId'
            ], Response::HTTP_BAD_REQUEST);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($data['storyId']);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if favorite already exists
        $existingFavorite = $this->entityManager->getRepository(Favorite::class)
            ->findOneBy(['user' => $user, 'story' => $story]);

        if ($existingFavorite) {
            // Remove from favorites
            $this->entityManager->remove($existingFavorite);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Story removed from favorites',
                'isFavorite' => false
            ]);
        } else {
            // Add to favorites
            $favorite = new Favorite();
            $favorite->setUser($user);
            $favorite->setStory($story);

            $this->entityManager->persist($favorite);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Story added to favorites',
                'isFavorite' => true
            ], Response::HTTP_CREATED);
        }
    }

    #[Route('/check/{storyId}', name: 'favorite_check', methods: ['GET'], requirements: ['storyId' => '\d+'])]
    public function check(int $storyId): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($storyId);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $favorite = $this->entityManager->getRepository(Favorite::class)
            ->findOneBy(['user' => $user, 'story' => $story]);

        return new JsonResponse([
            'isFavorite' => $favorite !== null
        ]);
    }

    #[Route('/{id}', name: 'favorite_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $favorite = $this->entityManager->getRepository(Favorite::class)->find($id);
        if (!$favorite) {
            return new JsonResponse([
                'error' => 'Favorite not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user owns this favorite
        if ($favorite->getUser()->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'Access denied. You can only delete your own favorites.'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($favorite);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Favorite deleted successfully'
        ]);
    }
}
