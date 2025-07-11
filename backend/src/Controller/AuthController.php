<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[Route('/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/register', name: 'auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données d'entrée
        if (!$data || !isset($data['email'], $data['username'], $data['password'])) {
            return new JsonResponse([
                'error' => 'Champs obligatoires manquants : email, username, password'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validation basique du mot de passe côté serveur
        if (strlen($data['password']) < 8) {
            return new JsonResponse([
                'error' => 'Le mot de passe doit contenir au moins 8 caractères'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Création de l'utilisateur
        $user = new User();
        $user->setEmail(trim($data['email']));
        $user->setUsername(trim($data['username']));
        $user->setRoles(['ROLE_USER']);
        
        // Champs optionnels
        if (isset($data['firstName']) && !empty(trim($data['firstName']))) {
            $user->setFirstName(trim($data['firstName']));
        }
        if (isset($data['lastName']) && !empty(trim($data['lastName']))) {
            $user->setLastName(trim($data['lastName']));
        }
        
        // Hash du mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Validation avec Symfony Validator
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse([
                'error' => 'Erreurs de validation',
                'details' => $errorMessages
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Sauvegarde en base
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Génération du token JWT
            $token = $this->jwtManager->create($user);

            return new JsonResponse([
                'message' => 'Inscription réussie ! Bienvenue sur LireLibre !',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'roles' => $user->getRoles(),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt()->format('c')
                ],
                'token' => $token
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Erreur lors de l\'inscription. Veuillez réessayer.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/login', name: 'auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['password'])) {
            return new JsonResponse([
                'error' => 'Missing required fields: email, password'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Find user by email
        $user = $this->entityManager->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse([
                'error' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verify password
        if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse([
                'error' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Generate JWT token
        $token = $this->jwtManager->create($user);

        return new JsonResponse([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'location' => $user->getLocation(),
                'website' => $user->getWebsite(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt()->format('c')
            ],
            'token' => $token
        ]);
    }

    #[Route('/refresh', name: 'auth_refresh', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier la présence du refresh token
        if (!$data || !isset($data['refresh_token'])) {
            return new JsonResponse([
                'error' => 'Refresh token manquant'
            ], Response::HTTP_BAD_REQUEST);
        }

        $refreshToken = $data['refresh_token'];

        try {
            // Décoder le refresh token pour récupérer l'utilisateur
            $payload = $this->jwtManager->parse($refreshToken);
            
            if (!isset($payload['username'])) {
                return new JsonResponse([
                    'error' => 'Refresh token invalide'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Récupérer l'utilisateur
            $user = $this->entityManager->getRepository(User::class)->findOneBy([
                'username' => $payload['username']
            ]);

            if (!$user) {
                return new JsonResponse([
                    'error' => 'Utilisateur non trouvé'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Générer un nouveau token d'accès
            $newToken = $this->jwtManager->create($user);

            // Optionnel: Générer aussi un nouveau refresh token pour rotation
            $newRefreshToken = $this->jwtManager->create($user);

            return new JsonResponse([
                'message' => 'Token rafraîchi avec succès',
                'token' => $newToken,
                'refresh_token' => $newRefreshToken,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'birthDate' => $user->getBirthDate()?->format('d/m/Y'),
                    'avatar' => $user->getAvatar()
                ]
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Refresh token invalide ou expiré: ' . $e->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/me', name: 'auth_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        error_log('Auth/me endpoint called');
        $user = $this->getUser();
        error_log('Retrieved user: ' . ($user instanceof User ? $user->getEmail() : 'null or not User instance'));

        if (!$user instanceof User) {
            error_log('User not authenticated or not instance of User class');
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        error_log('Returning user data for: ' . $user->getEmail());
        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'location' => $user->getLocation(),
                'website' => $user->getWebsite(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt()->format('c')
            ]
        ]);
    }

    #[Route('/user/profile', name: 'user_profile', methods: ['GET'])]
    public function getUserProfile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'location' => $user->getLocation(),
                'website' => $user->getWebsite(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt()?->format('c')
            ]
        ]);
    }

    #[Route('/user/profile', name: 'user_update_profile', methods: ['PUT', 'PATCH'])]
    public function updateUserProfile(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }
        if (isset($data['location'])) {
            $user->setLocation($data['location']);
        }
        if (isset($data['website'])) {
            $user->setWebsite($data['website']);
        }
        if (isset($data['birthDate'])) {
            $user->setBirthDate($data['birthDate'] ? new \DateTime($data['birthDate']) : null);
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'avatar' => $user->getAvatar(),
                'bio' => $user->getBio(),
                'location' => $user->getLocation(),
                'website' => $user->getWebsite(),
                'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getCreatedAt()->format('c'),
                'updatedAt' => $user->getUpdatedAt()?->format('c')
            ]
        ]);
    }

    #[Route('/user/avatar', name: 'user_upload_avatar', methods: ['POST'])]
    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $uploadedFile = $request->files->get('avatar');
        
        if (!$uploadedFile) {
            return new JsonResponse([
                'error' => 'No file uploaded'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($uploadedFile->getMimeType(), $allowedTypes)) {
            return new JsonResponse([
                'error' => 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate file size (max 5MB)
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($uploadedFile->getSize() > $maxSize) {
            return new JsonResponse([
                'error' => 'File too large. Maximum size is 5MB.'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Get file extension from original name or mime type
            $extension = $uploadedFile->getClientOriginalExtension();
            if (!$extension) {
                $mimeToExt = [
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp'
                ];
                $extension = $mimeToExt[$uploadedFile->getMimeType()] ?? 'jpg';
            }

            // Generate unique filename
            $filename = uniqid('avatar_', true) . '.' . $extension;
            
            // Define upload directory and file path
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/avatars/';
            $filePath = $uploadDir . $filename;
            
            // Ensure directory exists
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Move uploaded file to destination
            $uploadedFile->move($uploadDir, $filename);
            
            // Set avatar path in database (relative to public folder)
            $avatarPath = '/uploads/avatars/' . $filename;
            
            // Remove old avatar file if exists
            if ($user->getAvatar()) {
                $oldAvatarPath = $this->getParameter('kernel.project_dir') . '/public' . $user->getAvatar();
                if (file_exists($oldAvatarPath) && is_file($oldAvatarPath)) {
                    unlink($oldAvatarPath);
                }
            }
            
            $user->setAvatar($avatarPath);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Avatar uploaded successfully',
                'avatar' => $avatarPath,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'avatar' => $user->getAvatar(),
                    'bio' => $user->getBio(),
                    'location' => $user->getLocation(),
                    'website' => $user->getWebsite(),
                    'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                    'roles' => $user->getRoles(),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt()?->format('c')
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Error uploading avatar: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/user/avatar', name: 'user_remove_avatar', methods: ['DELETE'])]
    public function removeAvatar(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        try {
            // Remove old avatar file if exists
            if ($user->getAvatar()) {
                $oldAvatarPath = $this->getParameter('kernel.project_dir') . '/public' . $user->getAvatar();
                if (file_exists($oldAvatarPath) && is_file($oldAvatarPath)) {
                    unlink($oldAvatarPath);
                }
            }

            $user->setAvatar(null);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Avatar removed successfully',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'username' => $user->getUsername(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'avatar' => $user->getAvatar(),
                    'bio' => $user->getBio(),
                    'location' => $user->getLocation(),
                    'website' => $user->getWebsite(),
                    'birthDate' => $user->getBirthDate()?->format('Y-m-d'),
                    'roles' => $user->getRoles(),
                    'createdAt' => $user->getCreatedAt()->format('c'),
                    'updatedAt' => $user->getUpdatedAt()?->format('c')
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Error removing avatar: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/user/change-password', name: 'user_change_password', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'User not authenticated'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['currentPassword'], $data['newPassword'])) {
            return new JsonResponse([
                'error' => 'Current password and new password are required'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Verify current password
        if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
            return new JsonResponse([
                'error' => 'Current password is incorrect'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate new password
        if (strlen($data['newPassword']) < 8) {
            return new JsonResponse([
                'error' => 'New password must be at least 8 characters long'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Update password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
        $user->setPassword($hashedPassword);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Password changed successfully'
        ]);
    }
}
