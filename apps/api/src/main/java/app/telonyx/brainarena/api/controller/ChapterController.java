package app.telonyx.brainarena.api.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChapterController {
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
    public ChapterMapResponse chapterMap(@PathVariable String chapterSlug) {
        return new ChapterMapResponse(
            chapterSlug,
            "Глава I · Путь знатока",
            15,
            6,
            List.of(
                new ChapterNodeResponse(1, "Форум", "15 вопросов", 3, "MASTERED", 16, 74),
                new ChapterNodeResponse(2, "Акведук", "18 вопросов", 2, "COMPLETED", 42, 52),
                new ChapterNodeResponse(3, "Библиотека", "20 вопросов", 1, "IN_PROGRESS", 68, 32),
                new ChapterNodeResponse(4, "Сенат", "20 вопросов", 0, "LOCKED", 82, 62),
                new ChapterNodeResponse(5, "Колизей", "25 вопросов", 0, "LOCKED", 56, 82)
            )
        );
    }

    @PostMapping("/chapters/{chapterSlug}/nodes/{nodeId}/start")
    public NodeSessionResponse startNode(@PathVariable String chapterSlug, @PathVariable int nodeId) {
        return new NodeSessionResponse(
            "node-" + chapterSlug + "-" + nodeId + "-mvp",
            chapterSlug,
            nodeId,
            "Форум знатока",
            5,
            List.of(
                new QuizQuestionResponse(
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
                new QuizQuestionResponse(
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
                new QuizQuestionResponse(
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
                new QuizQuestionResponse(
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
                new QuizQuestionResponse(
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
            )
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
        List<QuizOptionResponse> options,
        String correctOptionId,
        String explanation
    ) {
    }

    public record QuizOptionResponse(String id, String text) {
    }
}
