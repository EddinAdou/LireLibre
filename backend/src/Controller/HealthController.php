<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class HealthController extends AbstractController
{
    #[Route('/health', name: 'api_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return $this->json([
            'status' => 'OK',
            'timestamp' => new \DateTime(),
            'service' => 'LireLibre API',
            'version' => '1.0.0'
        ]);
    }

    #[Route('/info', name: 'api_info', methods: ['GET'])]
    public function info(): JsonResponse
    {
        return $this->json([
            'application' => 'LireLibre',
            'description' => 'Plateforme collaborative d\'écriture et de lecture d\'histoires',
            'version' => '1.0.0',
            'symfony_version' => \Symfony\Component\HttpKernel\Kernel::VERSION,
            'php_version' => PHP_VERSION,
            'environment' => $this->getParameter('kernel.environment'),
            'endpoints' => [
                'health' => '/api/health',
                'info' => '/api/info',
                'stories' => '/api/stories',
                'users' => '/api/users',
                'auth' => '/api/auth'
            ]
        ]);
    }
}
