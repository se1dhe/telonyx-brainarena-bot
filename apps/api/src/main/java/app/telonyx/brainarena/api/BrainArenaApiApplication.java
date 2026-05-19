package app.telonyx.brainarena.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "app.telonyx.brainarena")
public class BrainArenaApiApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BrainArenaApiApplication.class);
        application.run(args);
    }
}
