package app.telonyx.brainarena.api.controller;

import app.telonyx.brainarena.domain.quiz.ResultCalculator;
import app.telonyx.brainarena.persistence.content.ContentCatalogPersistenceService;
import app.telonyx.brainarena.persistence.progress.UserNodeProgressEntity;
import app.telonyx.brainarena.persistence.progress.UserProgressPersistenceService;
import app.telonyx.brainarena.persistence.quiz.QuizSessionEntity;
import app.telonyx.brainarena.persistence.quiz.QuizSessionPersistenceService;
import app.telonyx.brainarena.persistence.user.TelegramAccountEntity;
import app.telonyx.brainarena.persistence.user.UserEntity;
import app.telonyx.brainarena.persistence.user.UserIdentityService;
import app.telonyx.brainarena.security.telegram.TelegramAuthResult;
import app.telonyx.brainarena.security.telegram.TelegramInitDataValidator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChapterController {
    private final ContentCatalogPersistenceService contentCatalogPersistenceService;
    private final QuizSessionPersistenceService quizSessionPersistenceService;
    private final UserProgressPersistenceService userProgressPersistenceService;
    private final TelegramInitDataValidator telegramInitDataValidator;
    private final UserIdentityService userIdentityService;

    public ChapterController(
        ContentCatalogPersistenceService contentCatalogPersistenceService,
        QuizSessionPersistenceService quizSessionPersistenceService,
        UserProgressPersistenceService userProgressPersistenceService,
        TelegramInitDataValidator telegramInitDataValidator,
        UserIdentityService userIdentityService
    ) {
        this.contentCatalogPersistenceService = contentCatalogPersistenceService;
        this.quizSessionPersistenceService = quizSessionPersistenceService;
        this.userProgressPersistenceService = userProgressPersistenceService;
        this.telegramInitDataValidator = telegramInitDataValidator;
        this.userIdentityService = userIdentityService;
    }

    @GetMapping("/courses")
    public List<CourseResponse> courses(@RequestHeader HttpHeaders headers) {
        UserEntity user = authenticatedUser(headers);
        return contentCatalogPersistenceService.courses()
            .stream()
            .map(course -> new CourseResponse(
                course.slug(),
                course.title(),
                course.maxStars(),
                userProgressPersistenceService.courseStars(user, course.slug())
            ))
            .toList();
    }

    @GetMapping("/courses/{courseSlug}/chapters")
    public List<ChapterResponse> chapters(@PathVariable String courseSlug, @RequestHeader HttpHeaders headers) {
        UserEntity user = authenticatedUser(headers);
        return contentCatalogPersistenceService.chapters(courseSlug)
            .stream()
            .map(chapter -> new ChapterResponse(
                chapter.slug(),
                chapter.title(),
                chapter.subtitle(),
                chapter.courseSlug(),
                chapter.maxStars(),
                userProgressPersistenceService.chapterStars(user, chapter.slug())
            ))
            .toList();
    }

    @GetMapping("/chapters/{chapterSlug}/map")
    public ChapterMapResponse chapterMap(@PathVariable String chapterSlug, @RequestHeader HttpHeaders headers) {
        UserEntity user = authenticatedUser(headers);
        ContentCatalogPersistenceService.ChapterRow chapter = contentCatalogPersistenceService.chapter(chapterSlug);
        Map<Integer, UserNodeProgressEntity> progress = userProgressPersistenceService.chapterProgress(user, chapterSlug);
        List<ChapterNodeResponse> nodes = buildNodeResponses(chapterSlug, progress);

        return new ChapterMapResponse(
            chapterSlug,
            chapter == null ? "Глава" : chapter.title(),
            chapter == null ? nodes.size() * 3 : chapter.maxStars(),
            nodes.stream().mapToInt(ChapterNodeResponse::stars).sum(),
            nodes
        );
    }

    @PostMapping("/chapters/{chapterSlug}/nodes/{nodeId}/start")
    public NodeSessionResponse startNode(
        @PathVariable String chapterSlug,
        @PathVariable int nodeId,
        @RequestHeader HttpHeaders headers
    ) {
        UserEntity user = authenticatedUser(headers);
        Map<Integer, UserNodeProgressEntity> progress = userProgressPersistenceService.chapterProgress(user, chapterSlug);
        if (!isNodeUnlocked(chapterSlug, nodeId, progress)) {
            throw new LockedNodeException();
        }

        String sessionId = "node-" + chapterSlug + "-" + nodeId + "-" + UUID.randomUUID();
        List<QuizQuestionDefinition> questions = contentCatalogPersistenceService.questions(chapterSlug, nodeId)
            .stream()
            .map(this::questionDefinition)
            .toList();
        quizSessionPersistenceService.startSession(sessionId, user, chapterSlug, nodeId, questions.size());
        ContentCatalogPersistenceService.NodeRow node = contentCatalogPersistenceService.node(chapterSlug, nodeId);

        return new NodeSessionResponse(
            sessionId,
            chapterSlug,
            nodeId,
            node == null ? "Точка" : node.title(),
            questions.size(),
            questions.stream().map(QuizQuestionDefinition::toResponse).toList()
        );
    }

    @PostMapping("/quiz/sessions/{sessionId}/answer")
    public QuizAnswerResponse answerQuestion(
        @PathVariable String sessionId,
        @RequestBody QuizAnswerRequest request
    ) {
        QuizQuestionDefinition question = findQuestion(request.questionId());
        if (question == null) {
            return QuizAnswerResponse.missingQuestion(request.questionId(), request.optionId());
        }

        boolean correct = question.correctOptionId().equals(request.optionId());
        QuizSessionPersistenceService.AnswerRecordResult record = quizSessionPersistenceService.recordAnswer(
            sessionId,
            question.id(),
            request.optionId(),
            question.correctOptionId(),
            correct
        );
        if (record.missingSessionResult()) {
            return QuizAnswerResponse.missingSession(request.questionId(), request.optionId());
        }

        QuizSessionEntity session = record.session();
        int answeredQuestions = quizSessionPersistenceService.answeredQuestions(sessionId);
        return new QuizAnswerResponse(
            question.id(),
            record.answer().getSelectedOptionId(),
            record.answer().getCorrectOptionId(),
            record.answer().isCorrect(),
            record.alreadyAnswered(),
            question.explanation(),
            session.getCorrectAnswers(),
            answeredQuestions,
            session.getTotalQuestions(),
            ResultCalculator.calculateStars(session.getCorrectAnswers(), session.getTotalQuestions())
        );
    }

    @PostMapping("/quiz/sessions/{sessionId}/finish")
    public QuizResultResponse finishSession(@PathVariable String sessionId) {
        QuizSessionEntity session = quizSessionPersistenceService.finishSession(sessionId);
        if (session == null) {
            return new QuizResultResponse(sessionId, 0, 0, 0, false);
        }

        int answeredQuestions = quizSessionPersistenceService.answeredQuestions(sessionId);
        int stars = ResultCalculator.calculateStars(session.getCorrectAnswers(), session.getTotalQuestions());
        boolean completed = answeredQuestions >= session.getTotalQuestions();
        if (completed) {
            userProgressPersistenceService.recordNodeCompletion(
                session.getUser(),
                session.getChapterSlug(),
                session.getNodeId(),
                stars,
                session.getCorrectAnswers(),
                session.getTotalQuestions()
            );
        }

        return new QuizResultResponse(
            sessionId,
            session.getCorrectAnswers(),
            session.getTotalQuestions(),
            stars,
            completed
        );
    }

    public record CourseResponse(String slug, String title, int maxStars, int earnedStars) {
    }

    public record ChapterResponse(
        String slug,
        String title,
        String subtitle,
        String courseSlug,
        int maxStars,
        int earnedStars
    ) {
    }

    public record ChapterMapResponse(
        String slug,
        String title,
        int maxStars,
        int earnedStars,
        List<ChapterNodeResponse> nodes
    ) {
    }

    public record ChapterNodeResponse(
        int id,
        String title,
        String subtitle,
        int stars,
        String status,
        int positionX,
        int positionY
    ) {
    }

    public record NodeSessionResponse(
        String sessionId,
        String chapterSlug,
        int nodeId,
        String title,
        int totalQuestions,
        List<QuizQuestionResponse> questions
    ) {
    }

    public record QuizQuestionResponse(
        String id,
        String type,
        String category,
        String prompt,
        List<QuizOptionResponse> options
    ) {
    }

    public record QuizOptionResponse(String id, String text) {
    }

    public record QuizAnswerRequest(String questionId, String optionId) {
    }

    public record QuizAnswerResponse(
        String questionId,
        String selectedOptionId,
        String correctOptionId,
        boolean correct,
        boolean alreadyAnswered,
        String explanation,
        int correctAnswers,
        int answeredQuestions,
        int totalQuestions,
        int stars
    ) {
        static QuizAnswerResponse missingSession(String questionId, String optionId) {
            return new QuizAnswerResponse(questionId, optionId, null, false, false, "Сессия уже завершена. Начни точку заново.", 0, 0, 0, 0);
        }

        static QuizAnswerResponse missingQuestion(String questionId, String optionId) {
            return new QuizAnswerResponse(questionId, optionId, null, false, false, "Вопрос не найден в этой точке.", 0, 0, 0, 0);
        }
    }

    public record QuizResultResponse(
        String sessionId,
        int correctAnswers,
        int totalQuestions,
        int stars,
        boolean completed
    ) {
    }

    private QuizQuestionDefinition findQuestion(String questionId) {
        ContentCatalogPersistenceService.QuestionRow question = contentCatalogPersistenceService.question(questionId);
        if (question == null) {
            return null;
        }

        return questionDefinition(question);
    }

    private List<ChapterNodeResponse> buildNodeResponses(
        String chapterSlug,
        Map<Integer, UserNodeProgressEntity> progress
    ) {
        List<ContentCatalogPersistenceService.NodeRow> nodes = contentCatalogPersistenceService.nodes(chapterSlug);
        boolean nextNodeUnlocked = true;
        java.util.ArrayList<ChapterNodeResponse> responses = new java.util.ArrayList<>();

        for (ContentCatalogPersistenceService.NodeRow node : nodes) {
            UserNodeProgressEntity nodeProgress = progress.get(node.nodeId());
            int stars = nodeProgress == null ? 0 : nodeProgress.getBestStars();
            String status = nodeStatus(stars, nextNodeUnlocked);
            responses.add(new ChapterNodeResponse(
                node.nodeId(),
                node.title(),
                node.subtitle(),
                stars,
                status,
                node.positionX(),
                node.positionY()
            ));

            nextNodeUnlocked = stars > 0;
        }

        return responses;
    }

    private boolean isNodeUnlocked(
        String chapterSlug,
        int nodeId,
        Map<Integer, UserNodeProgressEntity> progress
    ) {
        return buildNodeResponses(chapterSlug, progress)
            .stream()
            .anyMatch(node -> node.id() == nodeId && !"LOCKED".equals(node.status()));
    }

    private String nodeStatus(int stars, boolean unlocked) {
        if (stars >= 3) {
            return "MASTERED";
        }
        if (stars > 0) {
            return "COMPLETED";
        }
        return unlocked ? "IN_PROGRESS" : "LOCKED";
    }

    private QuizQuestionDefinition questionDefinition(ContentCatalogPersistenceService.QuestionRow question) {
        return new QuizQuestionDefinition(
            question.id(),
            question.type(),
            question.category(),
            question.prompt(),
            question.options().stream().map(option -> new QuizOptionResponse(option.id(), option.text())).toList(),
            question.correctOptionId(),
            question.explanation()
        );
    }

    private UserEntity authenticatedUser(HttpHeaders headers) {
        String initData = headers.getFirst("X-Telegram-Init-Data");
        TelegramAuthResult result = telegramInitDataValidator.validate(initData);
        if (!result.valid()) {
            return null;
        }

        TelegramAccountEntity account = userIdentityService.upsertTelegramUser(result.user());
        return account.getUser();
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    private static class LockedNodeException extends RuntimeException {
    }

    private record QuizQuestionDefinition(
        String id,
        String type,
        String category,
        String prompt,
        List<QuizOptionResponse> options,
        String correctOptionId,
        String explanation
    ) {
        QuizQuestionResponse toResponse() {
            return new QuizQuestionResponse(id, type, category, prompt, options);
        }
    }

}
