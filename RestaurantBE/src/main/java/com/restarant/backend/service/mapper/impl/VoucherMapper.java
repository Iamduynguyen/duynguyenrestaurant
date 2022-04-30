package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.VoucherDto;
import com.restarant.backend.entity.Voucher;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;
import org.springframework.stereotype.Component;

public class VoucherMapper extends AbstractDtoMapperAdapter<Voucher, VoucherDto> {
    public VoucherMapper(Class<Voucher> classParameter, Class<VoucherDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
}
