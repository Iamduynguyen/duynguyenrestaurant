package com.restarant.backend.web.socket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;

public class WebsocketCtrl {
    @MessageMapping({"/room/{roomId}"})
    @SendTo({"/topic/room/{roomId}"})
    public String sendMessage(@Payload String messager) {
        System.out.println(messager);
        return messager;
    }
}
