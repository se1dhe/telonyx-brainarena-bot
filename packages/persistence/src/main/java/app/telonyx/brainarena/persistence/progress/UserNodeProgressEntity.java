package app.telonyx.brainarena.persistence.progress;

import app.telonyx.brainarena.persistence.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
    name = "user_node_progress",
    uniqueConstraints = @UniqueConstraint(name = "user_node_progress_user_id_chapter_slug_node_id_key", columnNames = {
        "user_id",
        "chapter_slug",
        "node_id"
    })
)
public class UserNodeProgressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "chapter_slug", nullable = false, length = 96)
    private String chapterSlug;

    @Column(name = "node_id", nullable = false)
    private Integer nodeId;

    @Column(name = "best_stars", nullable = false)
    private Integer bestStars = 0;

    @Column(name = "best_correct_answers", nullable = false)
    private Integer bestCorrectAnswers = 0;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 0;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected UserNodeProgressEntity() {
    }

    public UserNodeProgressEntity(UserEntity user, String chapterSlug, Integer nodeId) {
        this.user = user;
        this.chapterSlug = chapterSlug;
        this.nodeId = nodeId;
    }

    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Integer getNodeId() {
        return nodeId;
    }

    public Integer getBestStars() {
        return bestStars;
    }

    public void recordCompletion(Integer stars, Integer correctAnswers, Integer totalQuestions) {
        this.bestStars = Math.max(this.bestStars, stars);
        this.bestCorrectAnswers = Math.max(this.bestCorrectAnswers, correctAnswers);
        this.totalQuestions = totalQuestions;
        this.completedAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}
