package app.telonyx.brainarena.bot.telegram;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class TelegramLongPollingRunner implements ApplicationRunner, DisposableBean {
    private static final Logger log = LoggerFactory.getLogger(TelegramLongPollingRunner.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String botToken;
    private final String botUsername;
    private final String webappUrl;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread pollingThread;

    public TelegramLongPollingRunner(
        ObjectMapper objectMapper,
        @Value("${brainarena.telegram.bot-token:}") String botToken,
        @Value("${brainarena.telegram.bot-username:iq_arenabot}") String botUsername,
        @Value("${brainarena.telegram.webapp-url:}") String webappUrl
    ) {
        this.objectMapper = objectMapper;
        this.botToken = botToken;
        this.botUsername = botUsername;
        this.webappUrl = webappUrl;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    }

    @Override
    public void run(ApplicationArguments args) {
        if (botToken == null || botToken.isBlank()) {
            log.warn("Telegram bot token is not configured; polling is disabled");
            return;
        }

        running.set(true);
        pollingThread = new Thread(this::pollLoop, "telegram-long-polling");
        pollingThread.setDaemon(false);
        pollingThread.start();
        log.info("Telegram polling started for @{}", botUsername);
    }

    @Override
    public void destroy() throws InterruptedException {
        running.set(false);
        if (pollingThread != null) {
            pollingThread.interrupt();
            pollingThread.join(Duration.ofSeconds(5).toMillis());
        }
    }

    private void pollLoop() {
        long offset = 0;

        while (running.get()) {
            try {
                JsonNode response = callTelegram("getUpdates?timeout=25&offset=" + offset, null);
                if (!response.path("ok").asBoolean(false)) {
                    log.warn("Telegram getUpdates returned ok=false");
                    sleepQuietly(Duration.ofSeconds(3));
                    continue;
                }

                for (JsonNode update : response.path("result")) {
                    offset = Math.max(offset, update.path("update_id").asLong() + 1);
                    handleUpdate(update);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception e) {
                log.warn("Telegram polling iteration failed: {}", e.getMessage());
                sleepQuietly(Duration.ofSeconds(3));
            }
        }
    }

    private void handleUpdate(JsonNode update) throws IOException, InterruptedException {
        JsonNode message = update.path("message");
        if (message.isMissingNode() || message.path("chat").path("id").isMissingNode()) {
            return;
        }

        String text = message.path("text").asText("");
        if (text.startsWith("/start")) {
            sendStartMessage(message.path("chat").path("id").asLong());
        }
    }

    private void sendStartMessage(long chatId) throws IOException, InterruptedException {
        ObjectNode body = objectMapper.createObjectNode();
        body.put("chat_id", chatId);
        body.put("parse_mode", "HTML");
        body.put(
            "text",
            "Brain Arena готова.\n\nПроходи карту, собирай звезды и выходи в дуэли умов."
        );

        if (webappUrl != null && !webappUrl.isBlank()) {
            ObjectNode webApp = objectMapper.createObjectNode();
            webApp.put("url", webappUrl);

            ObjectNode button = objectMapper.createObjectNode();
            button.put("text", "Открыть Brain Arena");
            button.set("web_app", webApp);

            ArrayNode row = objectMapper.createArrayNode().add(button);
            ArrayNode keyboard = objectMapper.createArrayNode().add(row);
            ObjectNode replyMarkup = objectMapper.createObjectNode();
            replyMarkup.set("inline_keyboard", keyboard);
            body.set("reply_markup", replyMarkup);
        }

        callTelegram("sendMessage", body);
    }

    private JsonNode callTelegram(String method, ObjectNode body) throws IOException, InterruptedException {
        String apiUrl = "https://api.telegram.org/bot" + botToken + "/" + method;
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
            .uri(URI.create(encodeTelegramUrl(apiUrl)))
            .timeout(Duration.ofSeconds(35));

        if (body == null) {
            requestBuilder.GET();
        } else {
            requestBuilder
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)));
        }

        HttpResponse<String> response = httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            throw new IOException("Telegram API returned HTTP " + response.statusCode());
        }

        return objectMapper.readTree(response.body());
    }

    private String encodeTelegramUrl(String apiUrl) {
        int queryIndex = apiUrl.indexOf('?');
        if (queryIndex < 0) {
            return apiUrl;
        }

        String base = apiUrl.substring(0, queryIndex);
        String query = apiUrl.substring(queryIndex + 1);
        StringBuilder encoded = new StringBuilder(base).append('?');
        String[] pairs = query.split("&");

        for (int i = 0; i < pairs.length; i++) {
            if (i > 0) {
                encoded.append('&');
            }
            int equalsIndex = pairs[i].indexOf('=');
            if (equalsIndex < 0) {
                encoded.append(URLEncoder.encode(pairs[i], StandardCharsets.UTF_8));
            } else {
                encoded
                    .append(URLEncoder.encode(pairs[i].substring(0, equalsIndex), StandardCharsets.UTF_8))
                    .append('=')
                    .append(URLEncoder.encode(pairs[i].substring(equalsIndex + 1), StandardCharsets.UTF_8));
            }
        }

        return encoded.toString();
    }

    private void sleepQuietly(Duration duration) {
        try {
            Thread.sleep(duration.toMillis());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
