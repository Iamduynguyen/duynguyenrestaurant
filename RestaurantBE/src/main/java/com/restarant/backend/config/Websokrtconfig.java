package com.restarant.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class Websokrtconfig implements WebSocketMessageBrokerConfigurer {

    public Websokrtconfig() {
    }

    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(new String[]{"/ws-chat"}).withSockJS().setStreamBytesLimit(15360).setHttpMessageCacheSize(15360);
    }

    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes(new String[]{"/app"});
        registry.enableSimpleBroker(new String[]{"/topic"});
    }
}
