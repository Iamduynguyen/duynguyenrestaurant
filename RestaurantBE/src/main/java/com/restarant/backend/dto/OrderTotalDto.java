package com.restarant.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class OrderTotalDto {
    private Long id;
    private Long voucher;
    private String status;
    private Long orderTime;
    private Long createdAt;
    private BigDecimal amountTotal;
    private List<TableOrderDto> tableOrders;
    private Long paymentId;
    private CustomerDto customer;
    private StaffDto staff;
}
