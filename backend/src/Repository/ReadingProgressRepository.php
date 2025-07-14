<?php

namespace App\Repository;

use App\Entity\ReadingProgress;
use App\Entity\User;
use App\Entity\Story;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ReadingProgress>
 */
class ReadingProgressRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReadingProgress::class);
    }

    public function findByUserAndStory(User $user, Story $story): ?ReadingProgress
    {
        return $this->createQueryBuilder('rp')
            ->andWhere('rp.user = :user')
            ->andWhere('rp.story = :story')
            ->setParameter('user', $user)
            ->setParameter('story', $story)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByUser(User $user, int $limit = 20, int $offset = 0): array
    {
        return $this->createQueryBuilder('rp')
            ->leftJoin('rp.story', 's')
            ->addSelect('s')
            ->andWhere('rp.user = :user')
            ->setParameter('user', $user)
            ->orderBy('rp.lastReadAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function findRecentlyRead(User $user, int $limit = 10): array
    {
        return $this->createQueryBuilder('rp')
            ->leftJoin('rp.story', 's')
            ->addSelect('s')
            ->andWhere('rp.user = :user')
            ->andWhere('rp.percentageRead > 0')
            ->setParameter('user', $user)
            ->orderBy('rp.lastReadAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findInProgress(User $user, int $limit = 10): array
    {
        return $this->createQueryBuilder('rp')
            ->leftJoin('rp.story', 's')
            ->addSelect('s')
            ->andWhere('rp.user = :user')
            ->andWhere('rp.percentageRead > 0')
            ->andWhere('rp.percentageRead < 100')
            ->setParameter('user', $user)
            ->orderBy('rp.lastReadAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findCompleted(User $user, int $limit = 20, int $offset = 0): array
    {
        return $this->createQueryBuilder('rp')
            ->leftJoin('rp.story', 's')
            ->addSelect('s')
            ->andWhere('rp.user = :user')
            ->andWhere('rp.percentageRead >= 100')
            ->setParameter('user', $user)
            ->orderBy('rp.lastReadAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function getUserReadingStats(User $user): array
    {
        $qb = $this->createQueryBuilder('rp')
            ->select('COUNT(rp.id) as totalStories')
            ->addSelect('AVG(rp.percentageRead) as avgProgress')
            ->addSelect('SUM(rp.readingTimeMinutes) as totalReadingTime')
            ->addSelect('COUNT(CASE WHEN rp.percentageRead >= 100 THEN 1 END) as completedStories')
            ->addSelect('COUNT(CASE WHEN rp.percentageRead > 0 AND rp.percentageRead < 100 THEN 1 END) as inProgressStories')
            ->andWhere('rp.user = :user')
            ->setParameter('user', $user);

        return $qb->getQuery()->getSingleResult();
    }

    public function updateOrCreateProgress(
        User $user, 
        Story $story, 
        int $characterPosition, 
        int $wordPosition, 
        float $percentage,
        ?string $lastParagraph = null,
        ?int $readingTime = null
    ): ReadingProgress {
        $progress = $this->findByUserAndStory($user, $story);
        
        if (!$progress) {
            $progress = new ReadingProgress();
            $progress->setUser($user);
            $progress->setStory($story);
        }

        $progress->updateReadingPosition($characterPosition, $wordPosition, $percentage);
        
        if ($lastParagraph !== null) {
            $progress->setLastReadParagraph($lastParagraph);
        }
        
        if ($readingTime !== null) {
            $currentTime = $progress->getReadingTimeMinutes() ?? 0;
            $progress->setReadingTimeMinutes($currentTime + $readingTime);
        }

        $this->getEntityManager()->persist($progress);
        $this->getEntityManager()->flush();

        return $progress;
    }

    public function save(ReadingProgress $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ReadingProgress $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
