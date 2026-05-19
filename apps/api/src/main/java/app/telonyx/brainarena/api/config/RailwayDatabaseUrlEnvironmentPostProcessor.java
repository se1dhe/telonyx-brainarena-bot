package app.telonyx.brainarena.api.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

/**
 * Конвертирует Railway DATABASE_URL вида postgresql://user:pass@host:port/db
 * в JDBC-настройки Spring Boot/Hikari.
 *
 * Spring Boot datasource.url обязан начинаться с jdbc:, а Railway часто отдаёт
 * обычный URI без jdbc-префикса. Без этой прослойки приложение падает на старте
 * с ошибкой: URL must start with 'jdbc'.
 */
public class RailwayDatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {
    private static final String PROPERTY_SOURCE_NAME = "railwayDatabaseUrl";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (!StringUtils.hasText(databaseUrl)) {
            return;
        }

        if (databaseUrl.startsWith("jdbc:")) {
            Map<String, Object> properties = new LinkedHashMap<>();
            properties.put("spring.datasource.url", databaseUrl);
            environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
            return;
        }

        if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
            return;
        }

        URI uri = URI.create(databaseUrl);
        String[] userInfo = parseUserInfo(uri);
        String databaseName = normalizeDatabaseName(uri.getPath());
        String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort() + "/" + databaseName;

        if (StringUtils.hasText(uri.getQuery())) {
            jdbcUrl = jdbcUrl + "?" + uri.getQuery();
        }

        Map<String, Object> properties = new LinkedHashMap<>();
        properties.put("spring.datasource.url", jdbcUrl);
        properties.put("spring.datasource.username", userInfo[0]);
        properties.put("spring.datasource.password", userInfo[1]);

        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private String[] parseUserInfo(URI uri) {
        String rawUserInfo = uri.getRawUserInfo();
        if (!StringUtils.hasText(rawUserInfo)) {
            return new String[] {"", ""};
        }

        String[] parts = rawUserInfo.split(":", 2);
        String username = decode(parts[0]);
        String password = parts.length > 1 ? decode(parts[1]) : "";
        return new String[] {username, password};
    }

    private String normalizeDatabaseName(String path) {
        if (!StringUtils.hasText(path) || "/".equals(path)) {
            return "postgres";
        }

        return path.startsWith("/") ? path.substring(1) : path;
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
