package app.telonyx.brainarena.bot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "app.telonyx.brainarena")
public class BrainArenaBotApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BrainArenaBotApplication.class);
        application.run(args);
    }
}
