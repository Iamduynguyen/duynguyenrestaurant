package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.PaymentDto;
import com.restarant.backend.entity.Payment;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class PaymentMapper extends AbstractDtoMapperAdapter<Payment, PaymentDto> {
    public PaymentMapper(Class<Payment> classParameter, Class<PaymentDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
}
