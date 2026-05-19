package app.telonyx.brainarena.api.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicConfigController {
    @GetMapping("/config")
    public Map<String, Object> config() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("app", "Brain Arena");
        response.put("status", "ok");
        response.put("telegramMiniApp", true);
        response.put("generatedAt", Instant.now().toString());
        return response;
    }
}
