package com.restarant.backend.service.validate;

import com.restarant.backend.dto.OrderDetailsDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

public class OrderDetailsValidator {
    public void validate(OrderDetailsDto orderDetailsDto) throws InvalidDataExeception {
        if(orderDetailsDto == null){
            throw new InvalidDataExeception("OrderDetailsDto must not be null");
        }
        if(orderDetailsDto.getQuantity() != null && orderDetailsDto.getQuantity() < 0){
            throw new InvalidDataExeception("OrderDetailsDto[quantity] must > 0");
        }
        if(orderDetailsDto.getFoodDetalls() == null){
            throw new InvalidDataExeception("OrderDetailsDto[foodDetailDto] must not be null");
        }
        if(orderDetailsDto.getTableOrderId() == null){
            throw new InvalidDataExeception("tableOrderId must not be null");
        }
        if(orderDetailsDto.getFoodDetalls().getId() == null){
            throw new InvalidDataExeception("OrderDetailsDto[foodDetailDto[id]] must not be null");
        }
    }
}
