package com.restarant.backend.service.impl;

import com.restarant.backend.dto.PaymentDto;
import com.restarant.backend.entity.Payment;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.repository.PaymentRepository;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.IPaymentService;
import com.restarant.backend.service.IVoucherService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.PaymentValidator;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class PaymentService implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final TablesRepository tablesRepository;
    private final IConverterDto<Payment, PaymentDto> mapper;
    private final PaymentValidator paymentValidator;
    private final OrderTotalRepository orderTotalRepository;
    private final IVoucherService voucherService;

    public PaymentService(PaymentRepository paymentRepository,
                          TablesRepository tablesRepository,
                          IConverterDto<Payment, PaymentDto> mapper,
                          OrderTotalRepository orderTotalRepository,
                          IVoucherService voucherService) {
        this.paymentRepository = paymentRepository;
        this.tablesRepository = tablesRepository;
        this.mapper = mapper;
        this.orderTotalRepository = orderTotalRepository;
        this.voucherService = voucherService;
        paymentValidator = new PaymentValidator();
    }

    @Override
    public PaymentDto create(PaymentDto dto) throws InvalidDataExeception {
        paymentValidator.validate(dto);

        Payment payment = mapper.convertToEntity(dto);
        return null;
    }




    @Override
    public PaymentDto update(Long id, PaymentDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public PaymentDto getById(Long id) {
        return null;
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        return false;
    }

    @Override
    public List<PaymentDto> getAll() {
        return null;
    }

    @Override
    public List<PaymentDto> getAll(Pageable pageable) {
        return null;
    }
}
