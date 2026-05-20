package app.telonyx.brainarena.domain.daily;

import java.time.LocalDate;

public class StreakService {
    
    // Core domain logic, separated from persistence.

    public StreakUpdateResult updateStreak(int currentStreak, int longestStreak, LocalDate lastRitualDate, LocalDate today, int streakSaves) {
        if (lastRitualDate == null) {
            // First time ever
            return new StreakUpdateResult(1, Math.max(1, longestStreak), today, streakSaves);
        }

        if (lastRitualDate.equals(today)) {
            // Already did the ritual today, no change
            return new StreakUpdateResult(currentStreak, longestStreak, lastRitualDate, streakSaves);
        }

        if (lastRitualDate.plusDays(1).equals(today)) {
            // Consecutive day
            int newStreak = currentStreak + 1;
            return new StreakUpdateResult(newStreak, Math.max(newStreak, longestStreak), today, streakSaves);
        }

        // Missed one or more days
        long daysMissed = today.toEpochDay() - lastRitualDate.toEpochDay() - 1;
        
        if (streakSaves >= daysMissed) {
            // Has enough saves to cover the gap
            int newStreak = currentStreak + 1; // It increments as if they played
            int remainingSaves = streakSaves - (int) daysMissed;
            return new StreakUpdateResult(newStreak, Math.max(newStreak, longestStreak), today, remainingSaves);
        } else {
            // Streak broken
            return new StreakUpdateResult(1, longestStreak, today, streakSaves);
        }
    }

    public record StreakUpdateResult(int newCurrentStreak, int newLongestStreak, LocalDate newLastRitualDate, int remainingSaves) {}
}
