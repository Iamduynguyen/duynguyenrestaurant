package com.restarant.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;

@EnableSwagger2
@SpringBootApplication
public class RestaurantApplication {
    static final Logger log = LoggerFactory.getLogger(RestaurantApplication.class);
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(RestaurantApplication.class);
        Environment env = app.run(args).getEnvironment();
        //logApplicationStartup(env);
    }

//    private static void logApplicationStartup(Environment env) {
//        String protocol = Optional.ofNullable(env.getProperty("server.ssl.key-store")).map(key -> "https").orElse("http");
//        String serverPort = env.getProperty("server.port");
//        String contextPath = Optional
//                .ofNullable(env.getProperty("server.servlet.context-path"))
//                .orElse("/");
//        String hostAddress = "localhost";
//        try {
//            hostAddress = InetAddress.getLocalHost().getHostAddress();
//        } catch (UnknownHostException e) {
//            log.warn("The host name could not be determined, using `localhost` as fallback");
//        }
//        log.info(
//                "\n----------------------------------------------------------\n\t" +
//                        "Application '{}' is running! Access URLs:\n\t" +
//                        "Local: \t\t{}://localhost:{}{}\n\t" +
//                        "External: \t{}://{}:{}{}\n\t" +
//                        "Profile(s): \t{}\n----------------------------------------------------------",
//                env.getProperty("spring.application.name"),
//                protocol,
//                serverPort,
//                contextPath,
//                protocol,
//                hostAddress,
//                serverPort,
//                contextPath,
//                env.getActiveProfiles().length == 0 ? env.getDefaultProfiles() : env.getActiveProfiles()
//        );
//    }
}
