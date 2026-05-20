package app.telonyx.brainarena.persistence.daily;

import app.telonyx.brainarena.persistence.user.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStreakRepository extends CrudRepository<UserStreakEntity, Long> {
    Optional<UserStreakEntity> findByUser(UserEntity user);
}
