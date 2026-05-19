package app.telonyx.brainarena.security.telegram;

import java.time.Instant;

public record TelegramAuthResult(
    boolean valid,
    TelegramUser user,
    Instant authDate,
    String error
) {
    public static TelegramAuthResult ok(TelegramUser user, Instant authDate) {
        return new TelegramAuthResult(true, user, authDate, null);
    }

    public static TelegramAuthResult fail(String error) {
        return new TelegramAuthResult(false, null, null, error);
    }
}
