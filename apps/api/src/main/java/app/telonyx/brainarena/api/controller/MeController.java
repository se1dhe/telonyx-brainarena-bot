package app.telonyx.brainarena.api.controller;

import app.telonyx.brainarena.security.telegram.TelegramAuthResult;
import app.telonyx.brainarena.security.telegram.TelegramInitDataValidator;
import app.telonyx.brainarena.security.telegram.TelegramUser;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class MeController {
    private final TelegramInitDataValidator validator;

    public MeController(TelegramInitDataValidator validator) {
        this.validator = validator;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> me(@RequestHeader HttpHeaders headers) {
        String initData = headers.getFirst("X-Telegram-Init-Data");
        TelegramAuthResult result = validator.validate(initData);
        if (!result.valid()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", result.error()));
        }

        TelegramUser user = result.user();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("telegramId", user.id());
        response.put("username", user.username());
        response.put("firstName", user.firstName());
        response.put("lastName", user.lastName());
        response.put("photoUrl", user.photoUrl());
        response.put("authDate", result.authDate().toString());
        return ResponseEntity.ok(response);
    }
}
