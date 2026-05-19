package app.telonyx.brainarena.domain.quiz;

public final class ResultCalculator {
    private ResultCalculator() {
    }

    public static int calculateStars(int correctAnswers, int totalQuestions) {
        if (totalQuestions <= 0) {
            return 0;
        }

        double accuracy = (double) correctAnswers / (double) totalQuestions;

        // Звёзды считаются на сервере, чтобы клиент не мог подменить прогресс главы.
        if (accuracy >= 0.90) {
            return 3;
        }
        if (accuracy >= 0.70) {
            return 2;
        }
        if (accuracy >= 0.40) {
            return 1;
        }
        return 0;
    }
}
