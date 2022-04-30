package com.restarant.backend.web.controller;

import com.restarant.backend.model.Revenue;
import com.restarant.backend.service.IOrderTotalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class RevenueController {

    @Autowired
    private IOrderTotalService orderTotalService;

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenue(@RequestParam(value = "week", required = false) Integer week,
                                     @RequestParam(value = "month", required = false) Integer month,
                                     @RequestParam(value = "year", required = false) Integer year) {
        List<Revenue> list = new ArrayList<>();
        if (week != null) {
            LocalDateTime fromTime = LocalDateTime.of(year, month, (week - 1) * 7 + 1, 0, 0);
            LocalDateTime toTime = LocalDateTime.of(year, month, (week - 1) * 7 + 1, 23, 59);
            for (int i = 0; i < 7; i++) {

                BigDecimal totalInDay = orderTotalService
                        .getRevenueBetweenTime(fromTime.toEpochSecond(ZoneOffset.UTC), toTime.toEpochSecond(ZoneOffset.UTC));
                Revenue revenue = new Revenue();
                revenue.setFromTime(fromTime.toEpochSecond(ZoneOffset.UTC) * 1000);
                revenue.setToTime(toTime.toEpochSecond(ZoneOffset.UTC) * 1000);
                revenue.setTotal(totalInDay);
                list.add(revenue);

                fromTime = fromTime.plusDays(1);
                toTime = toTime.plusDays(1);
            }
        } else{
            LocalDateTime fromTime = LocalDateTime.of(year, 1, 1, 0, 0);
            LocalDateTime toTime = fromTime.plusMonths(1);
            for (int i = 0; i < 12; i++) {
                BigDecimal totalInDay = orderTotalService
                        .getRevenueBetweenTime(fromTime.toEpochSecond(ZoneOffset.UTC) * 1000, toTime.toEpochSecond(ZoneOffset.UTC) * 1000);
                Revenue revenue = new Revenue();
                revenue.setFromTime(fromTime.toEpochSecond(ZoneOffset.UTC) * 1000);
                revenue.setToTime(toTime.toEpochSecond(ZoneOffset.UTC) * 1000);
                revenue.setTotal(totalInDay);
                list.add(revenue);

                fromTime = fromTime.plusMonths(1);
                toTime = toTime.plusMonths(1);
            }
        }
        return ResponseEntity.ok(list);
    }
}
