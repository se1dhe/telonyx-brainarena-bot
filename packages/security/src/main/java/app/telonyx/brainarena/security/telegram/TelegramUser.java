package app.telonyx.brainarena.security.telegram;

public record TelegramUser(
    long id,
    String username,
    String firstName,
    String lastName,
    String photoUrl
) {
}
