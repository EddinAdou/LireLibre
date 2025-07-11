<?php

namespace App\Controller;

use App\Entity\Story;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/categories')]
class CategoryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('', name: 'categories_list', methods: ['GET'])]
    public function getCategories(): JsonResponse
    {
        // Categories predefined (could be from database if needed)
        $categories = [
            'fiction',
            'non-fiction',
            'romance',
            'mystery',
            'fantasy',
            'science-fiction',
            'horror',
            'thriller',
            'historical-fiction',
            'biography',
            'autobiography',
            'poetry',
            'drama',
            'comedy',
            'adventure',
            'children',
            'young-adult',
            'self-help',
            'health-fitness',
            'travel',
            'cooking',
            'technology',
            'business',
            'politics',
            'religion',
            'philosophy'
        ];

        return new JsonResponse([
            'categories' => $categories
        ]);
    }
}
