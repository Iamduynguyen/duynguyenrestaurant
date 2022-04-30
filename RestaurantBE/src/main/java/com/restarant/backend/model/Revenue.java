package com.restarant.backend.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Revenue {
    private Long fromTime;
    private Long toTime;
    private BigDecimal total;
}
