<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HealthController extends AbstractController
{
    #[Route('/api/health', name: 'health_check', methods: ['GET'])]
    public function check(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'OK',
            'message' => 'LireLibre API is running',
            'timestamp' => (new \DateTimeImmutable())->format('c'),
            'version' => '1.0.0'
        ]);
    }

    #[Route('/', name: 'api_root', methods: ['GET'])]
    public function root(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Welcome to LireLibre API',
            'version' => '1.0.0',
            'endpoints' => [
                'health' => '/api/health',
                'auth' => [
                    'register' => 'POST /api/auth/register',
                    'login' => 'POST /api/auth/login',
                    'me' => 'GET /api/auth/me'
                ],
                'stories' => [
                    'list' => 'GET /api/stories',
                    'show' => 'GET /api/stories/{id}',
                    'create' => 'POST /api/stories',
                    'update' => 'PUT /api/stories/{id}',
                    'delete' => 'DELETE /api/stories/{id}'
                ],
                'comments' => [
                    'list' => 'GET /api/comments/story/{storyId}',
                    'create' => 'POST /api/comments',
                    'update' => 'PUT /api/comments/{id}',
                    'delete' => 'DELETE /api/comments/{id}'
                ],
                'favorites' => [
                    'list' => 'GET /api/favorites',
                    'toggle' => 'POST /api/favorites/toggle',
                    'check' => 'GET /api/favorites/check/{storyId}',
                    'delete' => 'DELETE /api/favorites/{id}'
                ]
            ]
        ]);
    }
}
