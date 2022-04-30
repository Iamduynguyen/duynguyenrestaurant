package com.restarant.backend.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class API {
    @GetMapping("/ping")
    public String getA(){
        return "ping";
    }
}
