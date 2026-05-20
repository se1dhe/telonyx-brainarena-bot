package app.telonyx.brainarena.persistence.daily;

import app.telonyx.brainarena.persistence.user.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyRitualRepository extends CrudRepository<DailyRitualEntity, Long> {
    Optional<DailyRitualEntity> findByUserAndRitualDate(UserEntity user, LocalDate ritualDate);
    Optional<DailyRitualEntity> findBySessionId(String sessionId);
}
