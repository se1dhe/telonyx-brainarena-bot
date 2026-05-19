package app.telonyx.brainarena.api.controller;

import app.telonyx.brainarena.domain.quiz.ResultCalculator;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChapterController {
    private final QuizSessionPersistenceService quizSessionPersistenceService;
    private final UserProgressPersistenceService userProgressPersistenceService;
    private final TelegramInitDataValidator telegramInitDataValidator;
    private final UserIdentityService userIdentityService;

    public ChapterController(
        QuizSessionPersistenceService quizSessionPersistenceService,
        UserProgressPersistenceService userProgressPersistenceService,
        TelegramInitDataValidator telegramInitDataValidator,
        UserIdentityService userIdentityService
    ) {
        this.quizSessionPersistenceService = quizSessionPersistenceService;
        this.userProgressPersistenceService = userProgressPersistenceService;
        this.telegramInitDataValidator = telegramInitDataValidator;
        this.userIdentityService = userIdentityService;
    }

    @GetMapping("/courses")
    public List<CourseResponse> courses() {
        return List.of(
            new CourseResponse("general-knowledge", "Общие знания", 15, 6),
            new CourseResponse("roman-history", "История Рима", 12, 5),
            new CourseResponse("logic", "Логика", 9, 4)
        );
    }

    @GetMapping("/courses/{courseSlug}/chapters")
    public List<ChapterResponse> chapters(@PathVariable String courseSlug) {
        return List.of(
            new ChapterResponse("path-of-scholar", "Глава I · Путь знатока", "Первый маршрут Brain Arena", courseSlug, 15, 6),
            new ChapterResponse("republic", "Глава II · Республика", "Откроется после первой главы", courseSlug, 15, 0)
        );
    }

    @GetMapping("/chapters/{chapterSlug}/map")
    public ChapterMapResponse chapterMap(@PathVariable String chapterSlug, @RequestHeader HttpHeaders headers) {
        UserEntity user = authenticatedUser(headers);
        List<ChapterNodeResponse> nodes = defaultMapNodes();
        if (user != null) {
            Map<Integer, UserNodeProgressEntity> progress = userProgressPersistenceService.chapterProgress(user, chapterSlug);
            nodes = nodes.stream().map(node -> applyProgress(node, progress.get(node.id()))).toList();
        }

        return new ChapterMapResponse(
            chapterSlug,
            "Глава I · Путь знатока",
            15,
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
        String sessionId = "node-" + chapterSlug + "-" + nodeId + "-" + UUID.randomUUID();
        List<QuizQuestionDefinition> questions = firstNodeQuestions();
        quizSessionPersistenceService.startSession(sessionId, authenticatedUser(headers), chapterSlug, nodeId, questions.size());
        ChapterNodeResponse node = defaultMapNodes().stream()
            .filter(candidate -> candidate.id() == nodeId)
            .findFirst()
            .orElse(new ChapterNodeResponse(nodeId, "Форум", "15 вопросов", 0, "IN_PROGRESS", 16, 74));

        return new NodeSessionResponse(
            sessionId,
            chapterSlug,
            nodeId,
            node.title(),
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

    private List<QuizQuestionDefinition> firstNodeQuestions() {
        return List.of(
            new QuizQuestionDefinition(
                "q-001",
                "MULTIPLE_CHOICE",
                "История",
                "Кто, согласно традиции, был первым царем Рима?",
                List.of(
                    new QuizOptionResponse("a", "Ромул"),
                    new QuizOptionResponse("b", "Нума Помпилий"),
                    new QuizOptionResponse("c", "Тарквиний Гордый"),
                    new QuizOptionResponse("d", "Сервий Туллий")
                ),
                "a",
                "Римская традиция связывает основание города с Ромулом."
            ),
            new QuizQuestionDefinition(
                "q-002",
                "TRUE_FALSE",
                "Наука",
                "Вода достигает наибольшей плотности примерно при 4 °C.",
                List.of(
                    new QuizOptionResponse("a", "Верно"),
                    new QuizOptionResponse("b", "Неверно")
                ),
                "a",
                "Это свойство объясняет, почему лед образуется сверху, а не со дна."
            ),
            new QuizQuestionDefinition(
                "q-003",
                "MULTIPLE_CHOICE",
                "География",
                "Какая столица расположена на реке Тибр?",
                List.of(
                    new QuizOptionResponse("a", "Афины"),
                    new QuizOptionResponse("b", "Рим"),
                    new QuizOptionResponse("c", "Мадрид"),
                    new QuizOptionResponse("d", "Прага")
                ),
                "b",
                "Рим исторически вырос на берегах Тибра."
            ),
            new QuizQuestionDefinition(
                "q-004",
                "MULTIPLE_CHOICE",
                "Кино",
                "В каком фильме звучит фраза «Я сделаю ему предложение, от которого он не сможет отказаться»?",
                List.of(
                    new QuizOptionResponse("a", "Касабланка"),
                    new QuizOptionResponse("b", "Крестный отец"),
                    new QuizOptionResponse("c", "Гладиатор"),
                    new QuizOptionResponse("d", "Лицо со шрамом")
                ),
                "b",
                "Это одна из самых известных реплик Вито Корлеоне."
            ),
            new QuizQuestionDefinition(
                "q-005",
                "MULTIPLE_CHOICE",
                "Логика",
                "Что продолжает ряд: 2, 4, 8, 16, ...?",
                List.of(
                    new QuizOptionResponse("a", "18"),
                    new QuizOptionResponse("b", "24"),
                    new QuizOptionResponse("c", "32"),
                    new QuizOptionResponse("d", "36")
                ),
                "c",
                "Каждый следующий член ряда вдвое больше предыдущего."
            )
        );
    }

    private QuizQuestionDefinition findQuestion(String questionId) {
        return firstNodeQuestions().stream()
            .filter(question -> question.id().equals(questionId))
            .findFirst()
            .orElse(null);
    }

    private List<ChapterNodeResponse> defaultMapNodes() {
        return List.of(
            new ChapterNodeResponse(1, "Форум", "15 вопросов", 3, "MASTERED", 16, 74),
            new ChapterNodeResponse(2, "Акведук", "18 вопросов", 2, "COMPLETED", 42, 52),
            new ChapterNodeResponse(3, "Библиотека", "20 вопросов", 1, "IN_PROGRESS", 68, 32),
            new ChapterNodeResponse(4, "Сенат", "20 вопросов", 0, "LOCKED", 82, 62),
            new ChapterNodeResponse(5, "Колизей", "25 вопросов", 0, "LOCKED", 56, 82)
        );
    }

    private ChapterNodeResponse applyProgress(ChapterNodeResponse node, UserNodeProgressEntity progress) {
        if (progress == null || progress.getBestStars() <= node.stars()) {
            return node;
        }

        String status = progress.getBestStars() >= 3 ? "MASTERED" : "COMPLETED";
        return new ChapterNodeResponse(
            node.id(),
            node.title(),
            node.subtitle(),
            progress.getBestStars(),
            status,
            node.positionX(),
            node.positionY()
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
