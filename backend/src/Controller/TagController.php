<?php

namespace App\Controller;

use App\Entity\Story;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/tags')]
class TagController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('/popular', name: 'api_tags_popular', methods: ['GET'])]
    public function getPopularTags(Request $request): JsonResponse
    {
        try {
            $limit = min(50, max(1, $request->query->getInt('limit', 20)));

            // Pour l'instant, retournons des tags par défaut
            $defaultTags = [
                ['tag' => 'aventure', 'count' => 15],
                ['tag' => 'amour', 'count' => 12],
                ['tag' => 'mystère', 'count' => 10],
                ['tag' => 'fantastique', 'count' => 8],
                ['tag' => 'science-fiction', 'count' => 7],
                ['tag' => 'histoire', 'count' => 6],
                ['tag' => 'famille', 'count' => 5],
                ['tag' => 'amitié', 'count' => 4],
                ['tag' => 'courage', 'count' => 3],
                ['tag' => 'découverte', 'count' => 2]
            ];
            
            return new JsonResponse([
                'tags' => array_slice($defaultTags, 0, $limit)
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur lors de la récupération des tags populaires',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/test', name: 'api_tags_test', methods: ['GET'])]
    public function testEndpoint(): JsonResponse
    {
        return new JsonResponse(['message' => 'Tags endpoint works!']);
    }
}
