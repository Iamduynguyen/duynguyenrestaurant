package com.restarant.backend.service.impl;

import com.restarant.backend.dto.VoucherDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.Voucher;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.model.Rank;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.repository.VoucherRepository;
import com.restarant.backend.service.IVoucherService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class VoucherService implements IVoucherService {

    private final OrderTotalRepository orderTotalRepository;
    private final VoucherRepository voucherRepository;
    private final IConverterDto<Voucher, VoucherDto> mapper;

    public VoucherService(OrderTotalRepository orderTotalRepository,
                          VoucherRepository voucherRepository,
                          IConverterDto<Voucher, VoucherDto> mapper) {
        this.orderTotalRepository = orderTotalRepository;
        this.voucherRepository = voucherRepository;
        this.mapper = mapper;
    }

    @Override
    public VoucherDto create(VoucherDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public VoucherDto createVoucherByCustomerId(Long customerId) {
        List<OrderTotal> orderTotals =
                orderTotalRepository.getListOrderTotalByCustomerId(customerId, OrderTotalStatus.PAID);

        BigDecimal totalBeforeAddOrderTotal = new BigDecimal(0);
        for (OrderTotal orderTotal : orderTotals) {
            totalBeforeAddOrderTotal = totalBeforeAddOrderTotal.add(orderTotal.getAmountTotal());
        }

        OrderTotal orderTotalAdd = orderTotalRepository.getOrderTotalByCustomerId(customerId);

        Rank rankBeforeAddOrderTotal = Rank.getRanking(totalBeforeAddOrderTotal);
        Rank rankAfterAddOrderTotal = Rank.getRanking(
                totalBeforeAddOrderTotal.add(orderTotalAdd.getAmountTotal()));

        if (rankAfterAddOrderTotal != null && !rankAfterAddOrderTotal.equals(rankBeforeAddOrderTotal)) {
            Customer customer = new Customer();
            customer.setId(customerId);

            Voucher voucher = new Voucher();
            voucher.setCustomer(customer);
            voucher.setCreated(LocalDate.now());
            voucher.setMaxMoney(rankAfterAddOrderTotal.getRankDiscount().getMaxMoney());
            voucher.setPercent((long) rankAfterAddOrderTotal.getRankDiscount().getPercent());

            return mapper.convertToDto(
                    voucherRepository.save(voucher)
            );
        }
        return null;
    }

    @Override
    public VoucherDto getVoucherByCustomerId(Long id) {
        return mapper.convertToDto(
                voucherRepository.findByCustomerId(id)
        );
    }

    @Override
    public VoucherDto update(Long id, VoucherDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public VoucherDto getById(Long id) {
        return null;
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        return false;
    }

    @Override
    public List<VoucherDto> getAll() {
        return null;
    }

    @Override
    public List<VoucherDto> getAll(Pageable pageable) {
        return null;
    }


}
