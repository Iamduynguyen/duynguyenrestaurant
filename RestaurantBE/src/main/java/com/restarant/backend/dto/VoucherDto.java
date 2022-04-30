package com.restarant.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherDto {
    private Long id;
    private Long percent;
    private BigDecimal maxMoney;
    private Long customerId;
}
