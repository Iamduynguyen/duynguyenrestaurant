package com.restarant.backend.dto;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class TableOrderDto {
    private Long id;
    private Long orderTime;
    private List<OrderDetailsDto> orderDetails;
    private Long tableId;
    private Long orderTotalId;
    private Long endTime;
}
