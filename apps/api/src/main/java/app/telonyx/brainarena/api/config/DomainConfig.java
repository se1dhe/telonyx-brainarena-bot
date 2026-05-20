package app.telonyx.brainarena.api.config;

import app.telonyx.brainarena.domain.ranked.RankService;
import app.telonyx.brainarena.domain.daily.StreakService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class DomainConfig {

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    public RankService rankService() {
        return new RankService();
    }

    @Bean
    public StreakService streakService() {
        return new StreakService();
    }
}
