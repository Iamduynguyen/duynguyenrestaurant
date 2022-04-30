package com.restarant.backend.service.validate;

import com.restarant.backend.dto.PaymentDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

import java.math.BigDecimal;

public class PaymentValidator {
    public void validate(PaymentDto dto) throws InvalidDataExeception {
        if(dto == null){
            throw new InvalidDataExeception("payment must not null");
        }
        if(dto.getDeposit().compareTo(new BigDecimal(0)) < 0){
            throw new InvalidDataExeception("deposit must > 0");
        }
        if(dto.getOrderTotal() == null || dto.getOrderTotal().getId() != null){
            throw new InvalidDataExeception("require payment[order-total, order-total-id]");
        }
    }
}
