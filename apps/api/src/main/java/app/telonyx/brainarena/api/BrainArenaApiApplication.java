package app.telonyx.brainarena.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(scanBasePackages = "app.telonyx.brainarena")
@EntityScan(basePackages = "app.telonyx.brainarena.persistence")
public class BrainArenaApiApplication {
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BrainArenaApiApplication.class);
        application.run(args);
    }
}
