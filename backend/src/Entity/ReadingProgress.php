<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'reading_progress')]
#[ORM\UniqueConstraint(name: 'user_story_unique', columns: ['user_id', 'story_id'])]
class ReadingProgress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['progress:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['progress:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Story::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['progress:read'])]
    private ?Story $story = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['progress:read', 'progress:write'])]
    private int $characterPosition = 0;

    #[ORM\Column(type: 'integer')]
    #[Groups(['progress:read', 'progress:write'])]
    private int $wordPosition = 0;

    #[ORM\Column(type: 'float')]
    #[Groups(['progress:read', 'progress:write'])]
    private float $percentageRead = 0.0;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['progress:read', 'progress:write'])]
    private ?string $lastReadParagraph = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['progress:read'])]
    private ?\DateTimeImmutable $lastReadAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['progress:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['progress:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['progress:read', 'progress:write'])]
    private ?int $readingTimeMinutes = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['progress:read', 'progress:write'])]
    private ?array $bookmarks = [];

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->lastReadAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getStory(): ?Story
    {
        return $this->story;
    }

    public function setStory(?Story $story): static
    {
        $this->story = $story;
        return $this;
    }

    public function getCharacterPosition(): int
    {
        return $this->characterPosition;
    }

    public function setCharacterPosition(int $characterPosition): static
    {
        $this->characterPosition = $characterPosition;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getWordPosition(): int
    {
        return $this->wordPosition;
    }

    public function setWordPosition(int $wordPosition): static
    {
        $this->wordPosition = $wordPosition;
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getPercentageRead(): float
    {
        return $this->percentageRead;
    }

    public function setPercentageRead(float $percentageRead): static
    {
        $this->percentageRead = max(0, min(100, $percentageRead));
        $this->updatedAt = new \DateTimeImmutable();
        return $this;
    }

    public function getLastReadParagraph(): ?string
    {
        return $this->lastReadParagraph;
    }

    public function setLastReadParagraph(?string $lastReadParagraph): static
    {
        $this->lastReadParagraph = $lastReadParagraph;
        return $this;
    }

    public function getLastReadAt(): ?\DateTimeImmutable
    {
        return $this->lastReadAt;
    }

    public function setLastReadAt(?\DateTimeImmutable $lastReadAt): static
    {
        $this->lastReadAt = $lastReadAt;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getReadingTimeMinutes(): ?int
    {
        return $this->readingTimeMinutes;
    }

    public function setReadingTimeMinutes(?int $readingTimeMinutes): static
    {
        $this->readingTimeMinutes = $readingTimeMinutes;
        return $this;
    }

    public function getBookmarks(): ?array
    {
        return $this->bookmarks ?? [];
    }

    public function setBookmarks(?array $bookmarks): static
    {
        $this->bookmarks = $bookmarks;
        return $this;
    }

    public function addBookmark(string $title, int $position, string $excerpt = ''): static
    {
        $bookmarks = $this->getBookmarks();
        $bookmarks[] = [
            'title' => $title,
            'position' => $position,
            'excerpt' => $excerpt,
            'createdAt' => (new \DateTimeImmutable())->format('Y-m-d H:i:s')
        ];
        $this->setBookmarks($bookmarks);
        return $this;
    }

    public function removeBookmark(int $position): static
    {
        $bookmarks = $this->getBookmarks();
        $bookmarks = array_filter($bookmarks, fn($bookmark) => $bookmark['position'] !== $position);
        $this->setBookmarks(array_values($bookmarks));
        return $this;
    }

    public function updateReadingPosition(int $characterPosition, int $wordPosition, float $percentage): static
    {
        $this->setCharacterPosition($characterPosition);
        $this->setWordPosition($wordPosition);
        $this->setPercentageRead($percentage);
        $this->lastReadAt = new \DateTimeImmutable();
        return $this;
    }
}
