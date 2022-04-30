package com.restarant.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDto {
    private Long id;
    private BigDecimal deposit;
    private Long status;
    private OrderTotalDto orderTotal;
}
