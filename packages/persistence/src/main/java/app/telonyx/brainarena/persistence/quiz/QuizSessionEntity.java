package app.telonyx.brainarena.persistence.quiz;

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
import java.time.Instant;

@Entity
@Table(name = "quiz_sessions")
public class QuizSessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_token", nullable = false, unique = true, length = 96)
    private String sessionToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "chapter_slug", nullable = false, length = 96)
    private String chapterSlug;

    @Column(name = "node_id", nullable = false)
    private Integer nodeId;

    @Column(name = "status", nullable = false, length = 24)
    private String status = "IN_PROGRESS";

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers = 0;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt = Instant.now();

    @Column(name = "finished_at")
    private Instant finishedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected QuizSessionEntity() {
    }

    public QuizSessionEntity(String sessionToken, String chapterSlug, Integer nodeId, Integer totalQuestions) {
        this.sessionToken = sessionToken;
        this.chapterSlug = chapterSlug;
        this.nodeId = nodeId;
        this.totalQuestions = totalQuestions;
    }

    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public String getChapterSlug() {
        return chapterSlug;
    }

    public Integer getNodeId() {
        return nodeId;
    }

    public String getStatus() {
        return status;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Instant getFinishedAt() {
        return finishedAt;
    }

    public void incrementCorrectAnswers() {
        this.correctAnswers++;
    }

    public void finish() {
        this.status = "COMPLETED";
        this.finishedAt = Instant.now();
        this.updatedAt = Instant.now();
    }
}
