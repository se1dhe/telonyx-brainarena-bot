package app.telonyx.brainarena.persistence.daily;

import app.telonyx.brainarena.persistence.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_streaks")
public class UserStreakEntity {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak = 0;

    @Column(name = "last_ritual_date")
    private LocalDate lastRitualDate;

    @Column(name = "streak_saves", nullable = false)
    private int streakSaves = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected UserStreakEntity() {}

    public UserStreakEntity(UserEntity user) {
        this.user = user;
    }

    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getUserId() { return userId; }
    public UserEntity getUser() { return user; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }
    public LocalDate getLastRitualDate() { return lastRitualDate; }
    public void setLastRitualDate(LocalDate lastRitualDate) { this.lastRitualDate = lastRitualDate; }
    public int getStreakSaves() { return streakSaves; }
    public void setStreakSaves(int streakSaves) { this.streakSaves = streakSaves; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
