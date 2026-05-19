package app.telonyx.brainarena.persistence.quiz;

import app.telonyx.brainarena.persistence.user.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class QuizSessionPersistenceService {
    private final EntityManager entityManager;

    public QuizSessionPersistenceService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional
    public QuizSessionEntity startSession(String sessionToken, String chapterSlug, int nodeId, int totalQuestions) {
        return startSession(sessionToken, null, chapterSlug, nodeId, totalQuestions);
    }

    @Transactional
    public QuizSessionEntity startSession(
        String sessionToken,
        UserEntity user,
        String chapterSlug,
        int nodeId,
        int totalQuestions
    ) {
        QuizSessionEntity session = new QuizSessionEntity(sessionToken, user, chapterSlug, nodeId, totalQuestions);
        entityManager.persist(session);
        return session;
    }

    @Transactional
    public AnswerRecordResult recordAnswer(
        String sessionToken,
        String questionId,
        String selectedOptionId,
        String correctOptionId,
        boolean correct
    ) {
        QuizSessionEntity session = findSession(sessionToken);
        if (session == null) {
            return AnswerRecordResult.missingSession();
        }

        QuizAnswerEntity existingAnswer = findAnswer(session, questionId);
        if (existingAnswer != null) {
            return new AnswerRecordResult(session, existingAnswer, true);
        }

        QuizAnswerEntity answer = new QuizAnswerEntity(session, questionId, selectedOptionId, correctOptionId, correct);
        entityManager.persist(answer);
        if (correct) {
            session.incrementCorrectAnswers();
        }
        return new AnswerRecordResult(session, answer, false);
    }

    @Transactional
    public QuizSessionEntity finishSession(String sessionToken) {
        QuizSessionEntity session = findSession(sessionToken);
        if (session == null) {
            return null;
        }

        session.finish();
        return session;
    }

    public int answeredQuestions(String sessionToken) {
        QuizSessionEntity session = findSession(sessionToken);
        if (session == null) {
            return 0;
        }

        Long count = entityManager
            .createQuery("select count(answer) from QuizAnswerEntity answer where answer.session = :session", Long.class)
            .setParameter("session", session)
            .getSingleResult();
        return count.intValue();
    }

    private QuizSessionEntity findSession(String sessionToken) {
        try {
            return entityManager
                .createQuery("select session from QuizSessionEntity session where session.sessionToken = :sessionToken", QuizSessionEntity.class)
                .setParameter("sessionToken", sessionToken)
                .getSingleResult();
        } catch (NoResultException ignored) {
            return null;
        }
    }

    private QuizAnswerEntity findAnswer(QuizSessionEntity session, String questionId) {
        try {
            return entityManager
                .createQuery(
                    "select answer from QuizAnswerEntity answer where answer.session = :session and answer.questionId = :questionId",
                    QuizAnswerEntity.class
                )
                .setParameter("session", session)
                .setParameter("questionId", questionId)
                .getSingleResult();
        } catch (NoResultException ignored) {
            return null;
        }
    }

    public record AnswerRecordResult(
        QuizSessionEntity session,
        QuizAnswerEntity answer,
        boolean alreadyAnswered
    ) {
        static AnswerRecordResult missingSession() {
            return new AnswerRecordResult(null, null, false);
        }

        public boolean missingSessionResult() {
            return session == null;
        }
    }
}
