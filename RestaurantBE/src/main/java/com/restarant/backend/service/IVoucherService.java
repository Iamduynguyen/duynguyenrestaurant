package com.restarant.backend.service;

import com.restarant.backend.dto.VoucherDto;
import com.restarant.backend.entity.Voucher;

public interface IVoucherService extends IServiceAdapter<VoucherDto>{
    VoucherDto createVoucherByCustomerId(Long id);

    VoucherDto getVoucherByCustomerId(Long id);
}
