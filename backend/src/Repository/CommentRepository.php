<?php

namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * @return Comment[] Returns an array of Comment objects for a story
     */
    public function findByStory($story): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.story = :story')
            ->setParameter('story', $story)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Comment[] Returns an array of Comment objects for a story (with pagination)
     */
    public function findByStoryPaginated($story, int $limit = 10, int $offset = 0): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.story = :story')
            ->setParameter('story', $story)
            ->orderBy('c.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }
}
