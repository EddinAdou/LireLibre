<?php

namespace App\Controller;

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
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/stories')]
class StoryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'story_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));
        $status = $request->query->get('status', 'published');
        $search = $request->query->get('search');
        $category = $request->query->get('category');
        $language = $request->query->get('language');
        $tags = $request->query->get('tags');

        $qb = $this->entityManager->getRepository(Story::class)->createQueryBuilder('s')
            ->leftJoin('s.author', 'a')
            ->addSelect('a');

        // Filter by status
        if ($status) {
            $qb->andWhere('s.status = :status')
               ->setParameter('status', $status);
        }

        // Search functionality - améliorer la recherche
        if ($search) {
            $qb->andWhere('(s.title LIKE :search OR s.content LIKE :search OR s.description LIKE :search)')
               ->setParameter('search', '%' . $search . '%');
        }

        // Filter by category
        if ($category) {
            $qb->andWhere('s.category = :category')
               ->setParameter('category', $category);
        }

        // Filter by language
        if ($language) {
            $qb->andWhere('s.language = :language')
               ->setParameter('language', $language);
        }

        // Filter by tags
        if ($tags) {
            $tagArray = explode(',', $tags);
            $qb->andWhere('s.tags LIKE :tags')
               ->setParameter('tags', '%' . implode('%', $tagArray) . '%');
        }

        // Pagination
        $qb->orderBy('s.createdAt', 'DESC')
           ->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        $stories = $qb->getQuery()->getResult();

        // Get total count for pagination
        $totalQb = $this->entityManager->getRepository(Story::class)->createQueryBuilder('s')
            ->select('COUNT(s.id)');

        if ($status) {
            $totalQb->andWhere('s.status = :status')
                    ->setParameter('status', $status);
        }

        if ($search) {
            $totalQb->andWhere('(s.title LIKE :search OR s.content LIKE :search OR s.description LIKE :search)')
                    ->setParameter('search', '%' . $search . '%');
        }

        if ($category) {
            $totalQb->andWhere('s.category = :category')
                    ->setParameter('category', $category);
        }

        if ($language) {
            $totalQb->andWhere('s.language = :language')
                    ->setParameter('language', $language);
        }

        if ($tags) {
            $tagArray = explode(',', $tags);
            $totalQb->andWhere('s.tags LIKE :tags')
                    ->setParameter('tags', '%' . implode('%', $tagArray) . '%');
        }

        $total = $totalQb->getQuery()->getSingleScalarResult();

        $serializedStories = $this->serializer->serialize(
            $stories, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'stories' => json_decode($serializedStories, true),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ]);
    }

    #[Route('/{id}', name: 'story_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        try {
            $story = $this->entityManager->getRepository(Story::class)->find($id);

            if (!$story) {
                return new JsonResponse([
                    'error' => 'Story not found'
                ], Response::HTTP_NOT_FOUND);
            }

            // Calculer les statistiques automatiquement
            $story->calculateStatistics();
            $this->entityManager->flush();

            return new JsonResponse([
                'story' => [
                    'id' => $story->getId(),
                    'title' => $story->getTitle(),
                    'description' => $story->getDescription(),
                    'content' => $story->getContent(),
                    'status' => $story->getStatus(),
                    'word_count' => $story->getWordCount(),
                    'character_count' => $story->getCharacterCount(),
                    'reading_time' => $story->getReadingTime(),
                    'language' => $story->getLanguage(),
                    'created_at' => $story->getCreatedAt()?->format('Y-m-d H:i:s'),
                    'updated_at' => $story->getUpdatedAt()?->format('Y-m-d H:i:s'),
                    'author' => [
                        'id' => $story->getAuthor()?->getId(),
                        'email' => $story->getAuthor()?->getEmail()
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Internal server error: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('', name: 'story_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Handle both JSON and FormData
        $contentType = $request->headers->get('Content-Type', '');
        
        if (str_contains($contentType, 'application/json')) {
            $data = json_decode($request->getContent(), true);
        } else {
            // Handle FormData from frontend
            $data = [
                'title' => $request->get('title'),
                'description' => $request->get('description'),
                'content' => $request->get('content'),
                'category' => $request->get('category'),
                'tags' => $request->get('tags'),
                'isPublished' => $request->get('isPublished'),
            ];
            
            // Handle coverImage file upload
            $coverImageFile = $request->files->get('coverImage');
        }

        if (!$data || !isset($data['title'], $data['content'])) {
            return new JsonResponse([
                'error' => 'Missing required fields: title, content'
            ], Response::HTTP_BAD_REQUEST);
        }

        $story = new Story();
        $story->setTitle($data['title']);
        $story->setContent($data['content']);
        $story->setAuthor($user);
        
        // Set description/summary
        if (isset($data['description'])) {
            $story->setSummary($data['description']);
        }
        
        // Set category/genre
        if (isset($data['category'])) {
            $story->setGenre($data['category']);
        }
        
        // Set tags
        if (isset($data['tags'])) {
            $tags = is_string($data['tags']) ? json_decode($data['tags'], true) : $data['tags'];
            $story->setTags($tags ?: []);
        }
        
        // Generate unique slug from title
        $baseSlug = $this->slugger->slug($data['title'])->lower();
        $slug = $baseSlug;
        $counter = 1;
        
        // Check if slug already exists and make it unique
        while ($this->entityManager->getRepository(Story::class)->findOneBy(['slug' => $slug])) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        $story->setSlug($slug);
        
        // Set language
        if (isset($data['language'])) {
            $story->setLanguage($data['language']);
        }

        // Set publication status
        $isPublished = $data['isPublished'] ?? false;
        if (is_string($isPublished)) {
            $isPublished = $isPublished === 'true';
        }
        $story->setIsPublished($isPublished);
        $story->setStatus($isPublished ? 'published' : 'draft');

        // Calculate text statistics automatically
        $story->calculateStatistics();

        // Handle cover image upload if provided
        if (isset($coverImageFile) && $coverImageFile) {
            // Here you would handle file upload logic
            // For now, we'll just store the filename
            $story->setCoverImage($coverImageFile->getClientOriginalName());
        }

        // Validate story
        $errors = $this->validator->validate($story);
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

        $this->entityManager->persist($story);
        $this->entityManager->flush();

        $serializedStory = $this->serializer->serialize(
            $story, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'message' => 'Story created successfully',
            'story' => json_decode($serializedStory, true)
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'story_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author
        if ($story->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'Access denied. You can only edit your own stories.'
            ], Response::HTTP_FORBIDDEN);
        }

        // Handle both JSON and FormData
        $contentType = $request->headers->get('Content-Type', '');
        
        if (str_contains($contentType, 'application/json')) {
            $data = json_decode($request->getContent(), true);
        } else {
            // Handle FormData from frontend
            $data = [
                'title' => $request->get('title'),
                'description' => $request->get('description'),
                'content' => $request->get('content'),
                'category' => $request->get('category'),
                'tags' => $request->get('tags'),
                'isPublished' => $request->get('isPublished'),
            ];
            
            // Handle coverImage file upload
            $coverImageFile = $request->files->get('coverImage');
        }

        if (isset($data['title'])) {
            $story->setTitle($data['title']);
            $slug = $this->slugger->slug($data['title'])->lower();
            $story->setSlug($slug);
        }

        if (isset($data['content'])) {
            $story->setContent($data['content']);
        }

        if (isset($data['description'])) {
            $story->setSummary($data['description']);
        }

        if (isset($data['category'])) {
            $story->setGenre($data['category']);
        }

        if (isset($data['tags'])) {
            $tags = is_string($data['tags']) ? json_decode($data['tags'], true) : $data['tags'];
            $story->setTags($tags ?: []);
        }

        if (isset($data['isPublished'])) {
            $isPublished = $data['isPublished'];
            if (is_string($isPublished)) {
                $isPublished = $isPublished === 'true';
            }
            $story->setIsPublished($isPublished);
            $story->setStatus($isPublished ? 'published' : 'draft');
        }

        if (isset($data['language'])) {
            $story->setLanguage($data['language']);
        }

        // Calculate text statistics automatically when content is updated
        $story->calculateStatistics();

        // Handle cover image upload if provided
        if (isset($coverImageFile) && $coverImageFile) {
            $story->setCoverImage($coverImageFile->getClientOriginalName());
        }

        if (isset($data['status']) && in_array($data['status'], ['draft', 'published', 'archived'])) {
            $story->setStatus($data['status']);
        }

        // Validate story
        $errors = $this->validator->validate($story);
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

        $serializedStory = $this->serializer->serialize(
            $story, 
            'json', 
            ['groups' => ['story:read']]
        );

        return new JsonResponse([
            'message' => 'Story updated successfully',
            'story' => json_decode($serializedStory, true)
        ]);
    }

    #[Route('/{id}', name: 'story_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is the author or has admin role
        if ($story->getAuthor()->getId() !== $user->getId() && !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse([
                'error' => 'Access denied. You can only delete your own stories.'
            ], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($story);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Story deleted successfully'
        ]);
    }

    #[Route('/{id}/like', name: 'story_like', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function toggleLike(int $id): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // For simplicity, we'll just increment/decrement like count
        // In a real app, you'd track user likes in a separate table
        $story->incrementLikeCount();
        $this->entityManager->flush();

        return new JsonResponse([
            'liked' => true,
            'likes' => $story->getLikeCount(),
            'message' => 'Story liked successfully'
        ]);
    }

    #[Route('/{id}/view', name: 'story_view', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function incrementViews(int $id): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $story->incrementViewCount();
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'View count incremented',
            'views' => $story->getViewCount()
        ]);
    }

    #[Route('/{id}/stats', name: 'story_stats', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getStoryStats(int $id): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Calculate reading time (approximate)
        $wordCount = str_word_count(strip_tags($story->getContent()));
        $readingTime = ceil($wordCount / 200); // 200 words per minute

        $stats = [
            'views' => $story->getViewCount(),
            'likes' => $story->getLikeCount(),
            'comments' => $story->getComments()->count(),
            'readingTime' => $readingTime,
            'chapters' => 1 // For now, assuming single chapter stories
        ];

        return new JsonResponse([
            'stats' => $stats
        ]);
    }

    #[Route('/{id}/chapters', name: 'story_chapters', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getChapters(int $id): JsonResponse
    {
        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // For now, return the story content as a single chapter
        // In the future, you could add a Chapter entity
        $chapters = [
            [
                'id' => 1,
                'title' => $story->getTitle(),
                'content' => $story->getContent(),
                'chapterNumber' => 1,
                'createdAt' => $story->getCreatedAt()->format('c'),
                'updatedAt' => $story->getUpdatedAt()->format('c')
            ]
        ];

        return new JsonResponse([
            'chapters' => $chapters
        ]);
    }

    #[Route('/{id}/chapters', name: 'story_create_chapter', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function createChapter(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return new JsonResponse([
                'error' => 'Authentication required'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $story = $this->entityManager->getRepository(Story::class)->find($id);
        if (!$story) {
            return new JsonResponse([
                'error' => 'Story not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($story->getAuthor()->getId() !== $user->getId()) {
            return new JsonResponse([
                'error' => 'Access denied'
            ], Response::HTTP_FORBIDDEN);
        }

        // For now, just return success - Chapter functionality would need Chapter entity
        return new JsonResponse([
            'message' => 'Chapter functionality not fully implemented yet',
            'chapter' => [
                'id' => 2,
                'title' => 'New Chapter',
                'content' => '',
                'chapterNumber' => 2
            ]
        ], Response::HTTP_CREATED);
    }
}
