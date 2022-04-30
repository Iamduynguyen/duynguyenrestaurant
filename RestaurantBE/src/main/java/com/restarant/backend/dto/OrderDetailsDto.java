package com.restarant.backend.dto;

import lombok.Data;

@Data
public class OrderDetailsDto {
    private Long id;
    private Long quantity;
    private FoodDetailsDto foodDetalls;
    private String status;
    private Long tableOrderId;
}
