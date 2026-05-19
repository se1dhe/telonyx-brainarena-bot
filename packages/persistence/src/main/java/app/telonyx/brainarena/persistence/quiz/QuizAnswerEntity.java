package app.telonyx.brainarena.persistence.quiz;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "quiz_answers")
public class QuizAnswerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private QuizSessionEntity session;

    @Column(name = "question_id", nullable = false, length = 96)
    private String questionId;

    @Column(name = "selected_option_id", nullable = false, length = 32)
    private String selectedOptionId;

    @Column(name = "correct_option_id", nullable = false, length = 32)
    private String correctOptionId;

    @Column(name = "is_correct", nullable = false)
    private Boolean correct;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt = Instant.now();

    protected QuizAnswerEntity() {
    }

    public QuizAnswerEntity(
        QuizSessionEntity session,
        String questionId,
        String selectedOptionId,
        String correctOptionId,
        Boolean correct
    ) {
        this.session = session;
        this.questionId = questionId;
        this.selectedOptionId = selectedOptionId;
        this.correctOptionId = correctOptionId;
        this.correct = correct;
    }

    public String getQuestionId() {
        return questionId;
    }

    public String getSelectedOptionId() {
        return selectedOptionId;
    }

    public String getCorrectOptionId() {
        return correctOptionId;
    }

    public Boolean isCorrect() {
        return correct;
    }
}
