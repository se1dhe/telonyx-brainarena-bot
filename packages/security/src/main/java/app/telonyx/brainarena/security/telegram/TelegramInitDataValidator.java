package app.telonyx.brainarena.security.telegram;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TelegramInitDataValidator {
    private static final Duration DEFAULT_MAX_AGE = Duration.ofHours(24);

    private final String botToken;
    private final Clock clock;
    private final Duration maxAge;

    public TelegramInitDataValidator(String botToken) {
        this(botToken, Clock.systemUTC(), DEFAULT_MAX_AGE);
    }

    public TelegramInitDataValidator(String botToken, Clock clock, Duration maxAge) {
        this.botToken = botToken;
        this.clock = clock;
        this.maxAge = maxAge;
    }

    public TelegramAuthResult validate(String initData) {
        if (botToken == null || botToken.isBlank()) {
            return TelegramAuthResult.fail("telegram_bot_token_missing");
        }
        if (initData == null || initData.isBlank()) {
            return TelegramAuthResult.fail("init_data_missing");
        }

        Map<String, String> values = parseQuery(initData);
        String receivedHash = values.remove("hash");
        if (receivedHash == null || receivedHash.isBlank()) {
            return TelegramAuthResult.fail("hash_missing");
        }

        String dataCheckString = buildDataCheckString(values);
        String calculatedHash = hmacHex(dataCheckString, hmacBytes(botToken, "WebAppData"));
        if (!constantTimeEquals(receivedHash, calculatedHash)) {
            return TelegramAuthResult.fail("hash_invalid");
        }

        Instant authDate = parseAuthDate(values.get("auth_date"));
        if (authDate == null) {
            return TelegramAuthResult.fail("auth_date_invalid");
        }
        if (authDate.plus(maxAge).isBefore(Instant.now(clock))) {
            return TelegramAuthResult.fail("auth_date_expired");
        }

        TelegramUser user = parseUser(values.get("user"));
        if (user == null) {
            return TelegramAuthResult.fail("user_missing");
        }

        return TelegramAuthResult.ok(user, authDate);
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> result = new HashMap<>();
        for (String pair : query.split("&")) {
            int index = pair.indexOf('=');
            if (index < 0) {
                continue;
            }
            String key = URLDecoder.decode(pair.substring(0, index), StandardCharsets.UTF_8);
            String value = URLDecoder.decode(pair.substring(index + 1), StandardCharsets.UTF_8);
            result.put(key, value);
        }
        return result;
    }

    private String buildDataCheckString(Map<String, String> values) {
        List<Map.Entry<String, String>> entries = new ArrayList<>(values.entrySet());
        entries.sort(Comparator.comparing(Map.Entry::getKey));
        List<String> lines = new ArrayList<>();
        for (Map.Entry<String, String> entry : entries) {
            lines.add(entry.getKey() + "=" + entry.getValue());
        }
        return String.join("\n", lines);
    }

    private Instant parseAuthDate(String raw) {
        try {
            if (raw == null || raw.isBlank()) {
                return null;
            }
            return Instant.ofEpochSecond(Long.parseLong(raw));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private TelegramUser parseUser(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            return null;
        }

        Long id = extractLong(rawJson, "id");
        if (id == null) {
            return null;
        }

        return new TelegramUser(
            id,
            extractString(rawJson, "username"),
            extractString(rawJson, "first_name"),
            extractString(rawJson, "last_name"),
            extractString(rawJson, "photo_url")
        );
    }

    private Long extractLong(String json, String field) {
        String marker = "\"" + field + "\":";
        int start = json.indexOf(marker);
        if (start < 0) {
            return null;
        }
        start += marker.length();
        int end = start;
        while (end < json.length() && Character.isDigit(json.charAt(end))) {
            end++;
        }
        if (end == start) {
            return null;
        }
        return Long.parseLong(json.substring(start, end));
    }

    private String extractString(String json, String field) {
        String marker = "\"" + field + "\":\"";
        int start = json.indexOf(marker);
        if (start < 0) {
            return null;
        }
        start += marker.length();
        StringBuilder value = new StringBuilder();
        boolean escaped = false;
        for (int i = start; i < json.length(); i++) {
            char c = json.charAt(i);
            if (escaped) {
                value.append(c);
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                return value.toString();
            } else {
                value.append(c);
            }
        }
        return null;
    }

    private byte[] hmacBytes(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("hmac_failed", e);
        }
    }

    private String hmacHex(String data, byte[] key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new IllegalStateException("hmac_failed", e);
        }
    }

    private boolean constantTimeEquals(String left, String right) {
        if (left == null || right == null || left.length() != right.length()) {
            return false;
        }
        int diff = 0;
        for (int i = 0; i < left.length(); i++) {
            diff |= left.charAt(i) ^ right.charAt(i);
        }
        return diff == 0;
    }
}
