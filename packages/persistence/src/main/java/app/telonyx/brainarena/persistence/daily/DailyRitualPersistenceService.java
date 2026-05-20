package app.telonyx.brainarena.persistence.daily;

import app.telonyx.brainarena.domain.daily.StreakService;
import app.telonyx.brainarena.persistence.user.UserEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class DailyRitualPersistenceService {
    private final DailyRitualRepository dailyRitualRepository;
    private final UserStreakRepository userStreakRepository;
    private final StreakService streakService;
    private final Clock clock;

    public DailyRitualPersistenceService(
        DailyRitualRepository dailyRitualRepository,
        UserStreakRepository userStreakRepository,
        StreakService streakService,
        Clock clock
    ) {
        this.dailyRitualRepository = dailyRitualRepository;
        this.userStreakRepository = userStreakRepository;
        this.streakService = streakService;
        this.clock = clock;
    }

    @Transactional
    public DailyRitualEntity startDailyRitual(UserEntity user, String sessionId) {
        LocalDate today = LocalDate.now(clock);
        
        Optional<DailyRitualEntity> existing = dailyRitualRepository.findByUserAndRitualDate(user, today);
        if (existing.isPresent()) {
            DailyRitualEntity ritual = existing.get();
            if (!ritual.isCompleted()) {
                ritual.setSessionId(sessionId);
                return dailyRitualRepository.save(ritual);
            }

            return ritual;
        }

        DailyRitualEntity ritual = new DailyRitualEntity(user, today, sessionId);
        return dailyRitualRepository.save(ritual);
    }

    @Transactional
    public DailyRitualEntity finishDailyRitual(String sessionId, int stars) {
        Optional<DailyRitualEntity> optional = dailyRitualRepository.findBySessionId(sessionId);
        if (optional.isEmpty()) {
            return null;
        }

        DailyRitualEntity ritual = optional.get();
        if (ritual.isCompleted()) {
            return ritual;
        }

        ritual.setCompleted(true);
        ritual.setStarsEarned(stars);
        ritual = dailyRitualRepository.save(ritual);

        // Update streak
        UserEntity user = ritual.getUser();
        UserStreakEntity streakEntity = userStreakRepository.findByUser(user)
            .orElseGet(() -> new UserStreakEntity(user));

        LocalDate today = LocalDate.now(clock);
        StreakService.StreakUpdateResult result = streakService.updateStreak(
            streakEntity.getCurrentStreak(),
            streakEntity.getLongestStreak(),
            streakEntity.getLastRitualDate(),
            today,
            streakEntity.getStreakSaves()
        );

        streakEntity.setCurrentStreak(result.newCurrentStreak());
        streakEntity.setLongestStreak(result.newLongestStreak());
        streakEntity.setLastRitualDate(result.newLastRitualDate());
        streakEntity.setStreakSaves(result.remainingSaves());

        userStreakRepository.save(streakEntity);

        return ritual;
    }
    
    @Transactional(readOnly = true)
    public UserStreakEntity getUserStreak(UserEntity user) {
        return userStreakRepository.findByUser(user).orElse(null);
    }
    
    @Transactional(readOnly = true)
    public DailyRitualEntity getTodayRitual(UserEntity user) {
        LocalDate today = LocalDate.now(clock);
        return dailyRitualRepository.findByUserAndRitualDate(user, today).orElse(null);
    }
}
