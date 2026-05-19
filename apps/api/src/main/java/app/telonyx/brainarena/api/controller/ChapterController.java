package app.telonyx.brainarena.api.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
}
