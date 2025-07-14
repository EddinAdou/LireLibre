<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Entity\Story;
use App\Repository\FavoriteRepository;
use App\Repository\StoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/favorites')]
class FavoriteController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private FavoriteRepository $favoriteRepository,
        private StoryRepository $storyRepository
    ) {}

    #[Route('', name: 'favorites_list', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $this->favoriteRepository->findBy(['user' => $user], ['createdAt' => 'DESC']);

        $data = [];
        foreach ($favorites as $favorite) {
            $story = $favorite->getStory();
            $data[] = [
                'id' => $favorite->getId(),
                'createdAt' => $favorite->getCreatedAt()->format('Y-m-d H:i:s'),
                'story' => [
                    'id' => $story->getId(),
                    'title' => $story->getTitle(),
                    'description' => $story->getDescription(),
                    'excerpt' => substr(strip_tags($story->getContent()), 0, 200) . '...',
                    'author' => [
                        'id' => $story->getAuthor()->getId(),
                        'username' => $story->getAuthor()->getUsername(),
                        'email' => $story->getAuthor()->getEmail()
                    ],
                    'createdAt' => $story->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updatedAt' => $story->getUpdatedAt()->format('Y-m-d H:i:s'),
                    'status' => $story->getStatus(),
                    'category' => $story->getCategory() ? [
                        'id' => $story->getCategory()->getId(),
                        'name' => $story->getCategory()->getName()
                    ] : null,
                    'tags' => array_map(fn($tag) => [
                        'id' => $tag->getId(),
                        'name' => $tag->getName()
                    ], $story->getTags()->toArray()),
                    'likesCount' => $story->getLikesCount(),
                    'commentsCount' => $story->getCommentsCount(),
                    'viewsCount' => $story->getViewsCount()
                ]
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'favorites_add', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function add(int $id): JsonResponse
    {
        $user = $this->getUser();
        $story = $this->storyRepository->find($id);

        if (!$story) {
            return $this->json(['error' => 'Histoire non trouvée'], Response::HTTP_NOT_FOUND);
        }

        if (!$story->isPublished()) {
            return $this->json(['error' => 'Impossible d\'ajouter aux favoris une histoire non publiée'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si déjà en favoris
        $existingFavorite = $this->favoriteRepository->findOneBy([
            'user' => $user,
            'story' => $story
        ]);

        if ($existingFavorite) {
            return $this->json(['error' => 'Histoire déjà dans vos favoris'], Response::HTTP_CONFLICT);
        }

        $favorite = new Favorite();
        $favorite->setUser($user);
        $favorite->setStory($story);
        $favorite->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($favorite);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Histoire ajoutée aux favoris',
            'favorite' => [
                'id' => $favorite->getId(),
                'createdAt' => $favorite->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'favorites_remove', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function remove(int $id): JsonResponse
    {
        $user = $this->getUser();
        $story = $this->storyRepository->find($id);

        if (!$story) {
            return $this->json(['error' => 'Histoire non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $favorite = $this->favoriteRepository->findOneBy([
            'user' => $user,
            'story' => $story
        ]);

        if (!$favorite) {
            return $this->json(['error' => 'Cette histoire n\'est pas dans vos favoris'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($favorite);
        $this->entityManager->flush();

        return $this->json(['message' => 'Histoire retirée des favoris']);
    }

    #[Route('/check/{id}', name: 'favorites_check', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function check(int $id): JsonResponse
    {
        $user = $this->getUser();
        $story = $this->storyRepository->find($id);

        if (!$story) {
            return $this->json(['error' => 'Histoire non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $favorite = $this->favoriteRepository->findOneBy([
            'user' => $user,
            'story' => $story
        ]);

        return $this->json([
            'isFavorite' => $favorite !== null,
            'favoriteId' => $favorite ? $favorite->getId() : null
        ]);
    }
}
