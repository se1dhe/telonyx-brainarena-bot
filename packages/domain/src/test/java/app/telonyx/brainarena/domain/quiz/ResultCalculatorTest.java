package app.telonyx.brainarena.domain.quiz;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ResultCalculatorTest {
    @Test
    void calculatesChapterStarsByAccuracy() {
        assertEquals(3, ResultCalculator.calculateStars(90, 100));
        assertEquals(2, ResultCalculator.calculateStars(70, 100));
        assertEquals(1, ResultCalculator.calculateStars(40, 100));
        assertEquals(0, ResultCalculator.calculateStars(30, 100));
    }
}
