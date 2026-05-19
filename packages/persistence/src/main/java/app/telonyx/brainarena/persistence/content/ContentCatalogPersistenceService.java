package app.telonyx.brainarena.persistence.content;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ContentCatalogPersistenceService {
    private final EntityManager entityManager;

    public ContentCatalogPersistenceService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<CourseRow> courses() {
        return entityManager
            .createNativeQuery("select slug, title, max_stars from courses order by sort_order, id")
            .getResultList()
            .stream()
            .map(row -> {
                Object[] values = (Object[]) row;
                return new CourseRow((String) values[0], (String) values[1], intValue(values[2]));
            })
            .toList();
    }

    public List<ChapterRow> chapters(String courseSlug) {
        return entityManager
            .createNativeQuery(
                "select slug, title, subtitle, course_slug, max_stars from chapters where course_slug = ? order by sort_order, id"
            )
            .setParameter(1, courseSlug)
            .getResultList()
            .stream()
            .map(row -> {
                Object[] values = (Object[]) row;
                return new ChapterRow(
                    (String) values[0],
                    (String) values[1],
                    (String) values[2],
                    (String) values[3],
                    intValue(values[4])
                );
            })
            .toList();
    }

    public ChapterRow chapter(String chapterSlug) {
        try {
            Object[] values = (Object[]) entityManager
                .createNativeQuery("select slug, title, subtitle, course_slug, max_stars from chapters where slug = ?")
                .setParameter(1, chapterSlug)
                .getSingleResult();
            return new ChapterRow(
                (String) values[0],
                (String) values[1],
                (String) values[2],
                (String) values[3],
                intValue(values[4])
            );
        } catch (NoResultException ignored) {
            return null;
        }
    }

    public List<NodeRow> nodes(String chapterSlug) {
        return entityManager
            .createNativeQuery(
                "select node_id, title, subtitle, total_questions, position_x, position_y "
                    + "from chapter_nodes where chapter_slug = ? order by sort_order, node_id"
            )
            .setParameter(1, chapterSlug)
            .getResultList()
            .stream()
            .map(row -> {
                Object[] values = (Object[]) row;
                return new NodeRow(
                    intValue(values[0]),
                    (String) values[1],
                    (String) values[2],
                    intValue(values[3]),
                    intValue(values[4]),
                    intValue(values[5])
                );
            })
            .toList();
    }

    public NodeRow node(String chapterSlug, int nodeId) {
        try {
            Object[] values = (Object[]) entityManager
                .createNativeQuery(
                    "select node_id, title, subtitle, total_questions, position_x, position_y "
                        + "from chapter_nodes where chapter_slug = ? and node_id = ?"
                )
                .setParameter(1, chapterSlug)
                .setParameter(2, nodeId)
                .getSingleResult();
            return new NodeRow(
                intValue(values[0]),
                (String) values[1],
                (String) values[2],
                intValue(values[3]),
                intValue(values[4]),
                intValue(values[5])
            );
        } catch (NoResultException ignored) {
            return null;
        }
    }

    public List<QuestionRow> questions(String chapterSlug, int nodeId) {
        return entityManager
            .createNativeQuery(
                "select id, type, category, prompt, correct_option_id, explanation "
                    + "from questions where chapter_slug = ? and node_id = ? order by sort_order"
            )
            .setParameter(1, chapterSlug)
            .setParameter(2, nodeId)
            .getResultList()
            .stream()
            .map(this::questionRow)
            .toList();
    }

    public QuestionRow question(String questionId) {
        try {
            Object row = entityManager
                .createNativeQuery("select id, type, category, prompt, correct_option_id, explanation from questions where id = ?")
                .setParameter(1, questionId)
                .getSingleResult();
            return questionRow(row);
        } catch (NoResultException ignored) {
            return null;
        }
    }

    private QuestionRow questionRow(Object row) {
        Object[] values = (Object[]) row;
        String questionId = (String) values[0];
        return new QuestionRow(
            questionId,
            (String) values[1],
            (String) values[2],
            (String) values[3],
            options(questionId),
            (String) values[4],
            (String) values[5]
        );
    }

    private List<OptionRow> options(String questionId) {
        return entityManager
            .createNativeQuery("select option_id, text from question_options where question_id = ? order by sort_order, id")
            .setParameter(1, questionId)
            .getResultList()
            .stream()
            .map(row -> {
                Object[] values = (Object[]) row;
                return new OptionRow((String) values[0], (String) values[1]);
            })
            .toList();
    }

    private int intValue(Object value) {
        return ((Number) value).intValue();
    }

    public record CourseRow(String slug, String title, int maxStars) {
    }

    public record ChapterRow(String slug, String title, String subtitle, String courseSlug, int maxStars) {
    }

    public record NodeRow(int nodeId, String title, String subtitle, int totalQuestions, int positionX, int positionY) {
    }

    public record QuestionRow(
        String id,
        String type,
        String category,
        String prompt,
        List<OptionRow> options,
        String correctOptionId,
        String explanation
    ) {
    }

    public record OptionRow(String id, String text) {
    }
}
