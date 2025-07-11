<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'stories')]
class Story
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['story:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['story:read', 'story:write', 'user:read'])]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['story:read', 'story:write'])]
    private ?string $content = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['story:read', 'story:write', 'user:read'])]
    private ?string $summary = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['story:read', 'story:write', 'user:read'])]
    private ?string $genre = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['story:read', 'story:write', 'user:read'])]
    private ?string $coverImage = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['story:read', 'story:write'])]
    private ?bool $isPublished = false;

    #[ORM\Column(type: 'integer')]
    #[Groups(['story:read'])]
    private int $viewCount = 0;

    #[ORM\Column(type: 'integer')]
    #[Groups(['story:read'])]
    private int $likeCount = 0;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['story:read', 'story:write'])]
    private ?array $tags = [];

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'stories')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['story:read'])]
    private ?User $author = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['story:read', 'user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['story:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'story', targetEntity: Comment::class, orphanRemoval: true)]
    private Collection $comments;

    #[ORM\OneToMany(mappedBy: 'story', targetEntity: Favorite::class, orphanRemoval: true)]
    private Collection $favorites;

    #[ORM\Column(type: 'string', length: 255, unique: true)]
    #[Groups(['story:read', 'story:write'])]
    private ?string $slug = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['story:read', 'story:write'])]
    private ?string $status = 'draft';

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['story:read'])]
    private ?int $wordCount = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['story:read'])]
    private ?int $characterCount = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['story:read'])]
    private ?int $readingTime = null; // en minutes

    #[ORM\Column(type: 'string', length: 10, nullable: true)]
    #[Groups(['story:read', 'story:write'])]
    private ?string $language = 'fr';

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function getSummary(): ?string
    {
        return $this->summary;
    }

    public function setSummary(?string $summary): static
    {
        $this->summary = $summary;
        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(string $genre): static
    {
        $this->genre = $genre;
        return $this;
    }

    public function getCoverImage(): ?string
    {
        return $this->coverImage;
    }

    public function setCoverImage(?string $coverImage): static
    {
        $this->coverImage = $coverImage;
        return $this;
    }

    public function isPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;
        return $this;
    }

    public function getViewCount(): int
    {
        return $this->viewCount;
    }

    public function setViewCount(int $viewCount): static
    {
        $this->viewCount = $viewCount;
        return $this;
    }

    public function incrementViewCount(): static
    {
        $this->viewCount++;
        return $this;
    }

    public function getLikeCount(): int
    {
        return $this->likeCount;
    }

    public function setLikeCount(int $likeCount): static
    {
        $this->likeCount = $likeCount;
        return $this;
    }

    public function incrementLikeCount(): static
    {
        $this->likeCount++;
        return $this;
    }

    public function decrementLikeCount(): static
    {
        $this->likeCount = max(0, $this->likeCount - 1);
        return $this;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): static
    {
        $this->tags = $tags;
        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setStory($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getStory() === $this) {
                $comment->setStory(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Favorite>
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Favorite $favorite): static
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites->add($favorite);
            $favorite->setStory($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): static
    {
        if ($this->favorites->removeElement($favorite)) {
            // set the owning side to null (unless already changed)
            if ($favorite->getStory() === $this) {
                $favorite->setStory(null);
            }
        }

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getWordCount(): ?int
    {
        return $this->wordCount;
    }

    public function setWordCount(?int $wordCount): static
    {
        $this->wordCount = $wordCount;
        return $this;
    }

    public function getCharacterCount(): ?int
    {
        return $this->characterCount;
    }

    public function setCharacterCount(?int $characterCount): static
    {
        $this->characterCount = $characterCount;
        return $this;
    }

    public function getReadingTime(): ?int
    {
        return $this->readingTime;
    }

    public function setReadingTime(?int $readingTime): static
    {
        $this->readingTime = $readingTime;
        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(?string $language): static
    {
        $this->language = $language;
        return $this;
    }

    /**
     * Calcule automatiquement les statistiques du texte
     */
    public function calculateStatistics(): static
    {
        if ($this->content) {
            // Nettoyer le contenu HTML pour le comptage
            $plainText = strip_tags($this->content);
            $plainText = html_entity_decode($plainText, ENT_QUOTES, 'UTF-8');
            $plainText = preg_replace('/\s+/', ' ', trim($plainText));

            // Compter les caractères
            $this->characterCount = mb_strlen($plainText, 'UTF-8');

            // Compter les mots
            if (!empty($plainText)) {
                $words = preg_split('/\s+/', $plainText, -1, PREG_SPLIT_NO_EMPTY);
                $this->wordCount = count($words);
                
                // Calculer le temps de lecture (200 mots par minute en moyenne)
                $this->readingTime = max(1, (int)ceil($this->wordCount / 200));
            } else {
                $this->wordCount = 0;
                $this->readingTime = 0;
            }
        } else {
            $this->wordCount = 0;
            $this->characterCount = 0;
            $this->readingTime = 0;
        }

        return $this;
    }

    /**
     * Retourne les statistiques sous forme de tableau
     */
    #[Groups(['story:read'])]
    public function getStatistics(): array
    {
        return [
            'wordCount' => $this->wordCount ?? 0,
            'characterCount' => $this->characterCount ?? 0,
            'readingTime' => $this->readingTime ?? 0,
            'viewCount' => $this->viewCount,
            'likeCount' => $this->likeCount,
            'commentCount' => $this->comments->count()
        ];
    }
}
