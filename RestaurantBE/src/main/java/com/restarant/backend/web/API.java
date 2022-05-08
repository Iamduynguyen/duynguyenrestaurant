package com.restarant.backend.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

@RestController
public class API {
    @GetMapping("/ping")
    public String getA(){
        return "ping";
    }

    @GetMapping("/time")
    public String getA(@RequestParam("t") Long time){
        LocalDateTime a = LocalDateTime.ofInstant(Instant.ofEpochSecond(time),
                TimeZone.getDefault().toZoneId());
        System.out.println(a.toString());
        return a.toString();
    }
}
