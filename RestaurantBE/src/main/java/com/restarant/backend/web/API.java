package com.restarant.backend.web;

import com.restarant.backend.service.utils.ConvertTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;

@RestController
public class API {

    @Autowired
    ConvertTime convertTime;
    @GetMapping("/ping")
    public String getA(){
        return "ping";
    }

    @GetMapping("/time")
    public String getA(@RequestParam("t") Long time){
        time = convertTime.validate(time);
        Long x = convertTime.addHour(time,5l);
        String a = convertTime.convertToLocalDateTime(x).toString();
        return a+"\t"+convertTime.convertToLocalDateTime(time)+"\t"+time+"\t"+x;
    }
}
