package com.restarant.backend.service.utils;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.TimeZone;

@Service
public class ConvertTime {
    public Long validate(Long time){
        if (time.toString().length()>10){
            time= time/1000;
        }
        System.out.println(time);
        return time;
    }

    public Date convertLocalDateTimeToDateUsingInstant(LocalDateTime dateToConvert) {
        return java.util.Date
                .from(dateToConvert.atZone(ZoneId.systemDefault())
                        .toInstant());
    }

//    public Date convertTodate(Long x){
//        return new java.text.SimpleDateFormat("MM/dd/yyyy HH:mm:ss").format(new java.util.Date (x));
//    }

    public LocalDateTime convertToLocalDateTime(Long time){
        LocalDateTime result = LocalDateTime.ofInstant(Instant.ofEpochSecond(time),
                TimeZone.getDefault().toZoneId());
        return result;
    }

    public Long convertTolong(LocalDateTime time){
        ZonedDateTime zdt = ZonedDateTime.of(time, ZoneId.systemDefault());
        Long result = zdt.toInstant().toEpochMilli();
         result = validate(result);
        return result;
    }

    public Long addHour(Long time,Long hour){
        LocalDateTime x = convertToLocalDateTime(time);
        System.out.println(x.toString()+"\t 1");
        x= x.plusHours(3l);
        System.out.println(x.toString()+"\t 2");
        return convertTolong(x);
    }

}
