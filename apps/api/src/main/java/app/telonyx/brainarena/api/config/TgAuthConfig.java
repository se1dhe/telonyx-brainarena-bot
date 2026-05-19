package app.telonyx.brainarena.api.config;

import app.telonyx.brainarena.security.telegram.TelegramInitDataValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TgAuthConfig {
    @Bean
    TelegramInitDataValidator telegramInitDataValidator() {
        String secret = System.getenv().getOrDefault("TELEGRAM_BOT_TOKEN", "");
        return new TelegramInitDataValidator(secret);
    }
}
