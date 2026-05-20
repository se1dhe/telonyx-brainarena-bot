package app.telonyx.brainarena.persistence.daily;

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
import java.time.LocalDate;

@Entity
@Table(name = "daily_rituals")
public class DailyRitualEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "ritual_date", nullable = false)
    private LocalDate ritualDate;

    @Column(name = "session_id", nullable = false, length = 128)
    private String sessionId;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "stars_earned", nullable = false)
    private int starsEarned = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected DailyRitualEntity() {}

    public DailyRitualEntity(UserEntity user, LocalDate ritualDate, String sessionId) {
        this.user = user;
        this.ritualDate = ritualDate;
        this.sessionId = sessionId;
    }

    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public UserEntity getUser() { return user; }
    public LocalDate getRitualDate() { return ritualDate; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public int getStarsEarned() { return starsEarned; }
    public void setStarsEarned(int starsEarned) { this.starsEarned = starsEarned; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
