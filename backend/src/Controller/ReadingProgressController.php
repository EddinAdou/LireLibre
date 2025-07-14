<?php

namespace App\Controller;

use App\Entity\ReadingProgress;
use App\Entity\Story;
use App\Entity\User;
use App\Repository\ReadingProgressRepository;
use App\Repository\StoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/reading-progress', name: 'api_reading_progress_')]
class ReadingProgressController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ReadingProgressRepository $progressRepository,
        private StoryRepository $storyRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/{storyId}', name: 'get', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getProgress(int $storyId): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $story = $this->storyRepository->find($storyId);
        if (!$story) {
            return new JsonResponse(['error' => 'Histoire non trouvée'], 404);
        }

        $progress = $this->progressRepository->findByUserAndStory($user, $story);
        
        if (!$progress) {
            return new JsonResponse([
                'characterPosition' => 0,
                'wordPosition' => 0,
                'percentageRead' => 0.0,
                'lastReadParagraph' => null,
                'bookmarks' => [],
                'readingTimeMinutes' => 0
            ]);
        }

        return new JsonResponse([
            'characterPosition' => $progress->getCharacterPosition(),
            'wordPosition' => $progress->getWordPosition(),
            'percentageRead' => $progress->getPercentageRead(),
            'lastReadParagraph' => $progress->getLastReadParagraph(),
            'lastReadAt' => $progress->getLastReadAt()?->format('Y-m-d H:i:s'),
            'bookmarks' => $progress->getBookmarks(),
            'readingTimeMinutes' => $progress->getReadingTimeMinutes()
        ]);
    }

    #[Route('/{storyId}', name: 'update', methods: ['POST', 'PUT'])]
    #[IsGranted('ROLE_USER')]
    public function updateProgress(int $storyId, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $story = $this->storyRepository->find($storyId);
        if (!$story) {
            return new JsonResponse(['error' => 'Histoire non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!$data) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $characterPosition = $data['characterPosition'] ?? 0;
        $wordPosition = $data['wordPosition'] ?? 0;
        $percentage = $data['percentageRead'] ?? 0.0;
        $lastParagraph = $data['lastReadParagraph'] ?? null;
        $readingTime = $data['readingTimeMinutes'] ?? null;

        try {
            $progress = $this->progressRepository->updateOrCreateProgress(
                $user,
                $story,
                $characterPosition,
                $wordPosition,
                $percentage,
                $lastParagraph,
                $readingTime
            );

            return new JsonResponse([
                'success' => true,
                'message' => 'Progrès de lecture sauvegardé',
                'data' => [
                    'characterPosition' => $progress->getCharacterPosition(),
                    'wordPosition' => $progress->getWordPosition(),
                    'percentageRead' => $progress->getPercentageRead(),
                    'lastReadAt' => $progress->getLastReadAt()?->format('Y-m-d H:i:s')
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur lors de la sauvegarde du progrès',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/{storyId}/bookmark', name: 'add_bookmark', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function addBookmark(int $storyId, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $story = $this->storyRepository->find($storyId);
        if (!$story) {
            return new JsonResponse(['error' => 'Histoire non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!$data || !isset($data['title'], $data['position'])) {
            return new JsonResponse(['error' => 'Titre et position requis'], 400);
        }

        $progress = $this->progressRepository->findByUserAndStory($user, $story);
        if (!$progress) {
            $progress = new ReadingProgress();
            $progress->setUser($user);
            $progress->setStory($story);
        }

        $progress->addBookmark(
            $data['title'],
            $data['position'],
            $data['excerpt'] ?? ''
        );

        $this->progressRepository->save($progress, true);

        return new JsonResponse([
            'success' => true,
            'message' => 'Marque-page ajouté',
            'bookmarks' => $progress->getBookmarks()
        ]);
    }

    #[Route('/{storyId}/bookmark/{position}', name: 'remove_bookmark', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function removeBookmark(int $storyId, int $position): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $story = $this->storyRepository->find($storyId);
        if (!$story) {
            return new JsonResponse(['error' => 'Histoire non trouvée'], 404);
        }

        $progress = $this->progressRepository->findByUserAndStory($user, $story);
        if (!$progress) {
            return new JsonResponse(['error' => 'Aucun progrès trouvé'], 404);
        }

        $progress->removeBookmark($position);
        $this->progressRepository->save($progress, true);

        return new JsonResponse([
            'success' => true,
            'message' => 'Marque-page supprimé',
            'bookmarks' => $progress->getBookmarks()
        ]);
    }

    #[Route('/user/recent', name: 'user_recent', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getRecentlyRead(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $limit = min($request->query->getInt('limit', 10), 50);
        $recentlyRead = $this->progressRepository->findRecentlyRead($user, $limit);

        $data = array_map(function($progress) {
            return [
                'story' => [
                    'id' => $progress->getStory()->getId(),
                    'title' => $progress->getStory()->getTitle(),
                    'author' => $progress->getStory()->getAuthor()->getUsername(),
                    'coverImage' => $progress->getStory()->getCoverImage(),
                    'genre' => $progress->getStory()->getGenre()
                ],
                'progress' => [
                    'percentageRead' => $progress->getPercentageRead(),
                    'lastReadAt' => $progress->getLastReadAt()?->format('Y-m-d H:i:s'),
                    'readingTimeMinutes' => $progress->getReadingTimeMinutes()
                ]
            ];
        }, $recentlyRead);

        return new JsonResponse([
            'recentlyRead' => $data,
            'total' => count($data)
        ]);
    }

    #[Route('/user/in-progress', name: 'user_in_progress', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getInProgress(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $limit = min($request->query->getInt('limit', 10), 50);
        $inProgress = $this->progressRepository->findInProgress($user, $limit);

        $data = array_map(function($progress) {
            return [
                'story' => [
                    'id' => $progress->getStory()->getId(),
                    'title' => $progress->getStory()->getTitle(),
                    'author' => $progress->getStory()->getAuthor()->getUsername(),
                    'coverImage' => $progress->getStory()->getCoverImage(),
                    'genre' => $progress->getStory()->getGenre()
                ],
                'progress' => [
                    'percentageRead' => $progress->getPercentageRead(),
                    'lastReadAt' => $progress->getLastReadAt()?->format('Y-m-d H:i:s'),
                    'characterPosition' => $progress->getCharacterPosition(),
                    'wordPosition' => $progress->getWordPosition()
                ]
            ];
        }, $inProgress);

        return new JsonResponse([
            'inProgress' => $data,
            'total' => count($data)
        ]);
    }

    #[Route('/user/stats', name: 'user_stats', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getUserStats(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $stats = $this->progressRepository->getUserReadingStats($user);

        return new JsonResponse([
            'stats' => [
                'totalStories' => (int)$stats['totalStories'],
                'completedStories' => (int)$stats['completedStories'],
                'inProgressStories' => (int)$stats['inProgressStories'],
                'averageProgress' => round((float)$stats['avgProgress'], 2),
                'totalReadingTimeMinutes' => (int)$stats['totalReadingTime'],
                'totalReadingTimeHours' => round((int)$stats['totalReadingTime'] / 60, 1)
            ]
        ]);
    }
}
