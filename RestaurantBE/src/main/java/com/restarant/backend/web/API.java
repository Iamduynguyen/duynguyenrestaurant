package com.restarant.backend.web;

import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.service.impl.OrderTotalService;
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
    @Autowired
    OrderTotalRepository orderTotalRepository;
    @Autowired
    OrderTotalService a;
    @GetMapping("/ping")
    public String getA(){
        return "ping";
    }

    @GetMapping("/time")
    public String getA(@RequestParam("t") Long id){
        OrderTotal f= orderTotalRepository.findById(id).get();
        a.changeTable(f);
        return "a";
    }

}
