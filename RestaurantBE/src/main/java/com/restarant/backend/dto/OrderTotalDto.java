package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
