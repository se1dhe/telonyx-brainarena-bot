package app.telonyx.brainarena.persistence.progress;

import app.telonyx.brainarena.persistence.user.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserProgressPersistenceService {
    private final EntityManager entityManager;

    public UserProgressPersistenceService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Map<Integer, UserNodeProgressEntity> chapterProgress(UserEntity user, String chapterSlug) {
        if (user == null) {
            return Map.of();
        }

        List<UserNodeProgressEntity> rows = entityManager
            .createQuery(
                "select progress from UserNodeProgressEntity progress "
                    + "where progress.user = :user and progress.chapterSlug = :chapterSlug",
                UserNodeProgressEntity.class
            )
            .setParameter("user", user)
            .setParameter("chapterSlug", chapterSlug)
            .getResultList();

        return rows.stream().collect(Collectors.toMap(UserNodeProgressEntity::getNodeId, row -> row));
    }

    @Transactional
    public UserNodeProgressEntity recordNodeCompletion(
        UserEntity user,
        String chapterSlug,
        int nodeId,
        int stars,
        int correctAnswers,
        int totalQuestions
    ) {
        if (user == null) {
            return null;
        }

        UserNodeProgressEntity progress = findProgress(user, chapterSlug, nodeId);
        if (progress == null) {
            progress = new UserNodeProgressEntity(user, chapterSlug, nodeId);
            entityManager.persist(progress);
        }

        progress.recordCompletion(stars, correctAnswers, totalQuestions);
        return progress;
    }

    private UserNodeProgressEntity findProgress(UserEntity user, String chapterSlug, int nodeId) {
        try {
            return entityManager
                .createQuery(
                    "select progress from UserNodeProgressEntity progress "
                        + "where progress.user = :user and progress.chapterSlug = :chapterSlug and progress.nodeId = :nodeId",
                    UserNodeProgressEntity.class
                )
                .setParameter("user", user)
                .setParameter("chapterSlug", chapterSlug)
                .setParameter("nodeId", nodeId)
                .getSingleResult();
        } catch (NoResultException ignored) {
            return null;
        }
    }
}
