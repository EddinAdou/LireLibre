<?php

namespace App\Repository;

use App\Entity\Story;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Story>
 */
class StoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Story::class);
    }

    /**
     * @return Story[] Returns an array of Story objects
     */
    public function findPublishedStories(): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.status = :status')
            ->setParameter('status', 'published')
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Story[] Returns an array of Story objects matching search criteria
     */
    public function searchStories(string $search = null, string $status = null, int $limit = 20): array
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.author', 'a')
            ->addSelect('a');

        if ($search) {
            $qb->andWhere('s.title LIKE :search OR s.summary LIKE :search OR s.content LIKE :search')
               ->setParameter('search', '%' . $search . '%');
        }

        if ($status) {
            $qb->andWhere('s.status = :status')
               ->setParameter('status', $status);
        }

        return $qb->orderBy('s.createdAt', 'DESC')
                  ->setMaxResults($limit)
                  ->getQuery()
                  ->getResult();
    }

    public function findOneByIdAndAuthor(int $id, $author): ?Story
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.id = :id')
            ->andWhere('s.author = :author')
            ->setParameter('id', $id)
            ->setParameter('author', $author)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
