package com.restarant.backend.service.impl;

import com.restarant.backend.dto.OrderTotalDto;
import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.repository.*;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class OrderTotalService implements IOrderTotalService {

    private final OrderTotalRepository orderTotalRepository;
    private final IConverterDto<OrderTotal, OrderTotalDto> mapper;
    private final IConverterDto<TableOrder, TableOrderDto> tableOrderMapper;
    private final CustomerRepository customerRepository;
    private final TableOrderRepository tableOrderRepository;
    private final TablesRepository tablesRepository;

    public OrderTotalService(OrderTotalRepository orderTotalRepository,
                             IConverterDto<OrderTotal, OrderTotalDto> mapper,
                             IConverterDto<TableOrder, TableOrderDto> tableOrderMapper, CustomerRepository customerRepository,
                             TableOrderRepository tableOrderRepository,
                             TablesRepository tablesRepository) {
        this.orderTotalRepository = orderTotalRepository;
        this.mapper = mapper;
        this.tableOrderMapper = tableOrderMapper;
        this.customerRepository = customerRepository;
        this.tableOrderRepository = tableOrderRepository;
        this.tablesRepository = tablesRepository;
    }

    @Override
    public OrderTotalDto create(OrderTotalDto dto) throws InvalidDataExeception {
        throw new NotImplementedException();
    }

    @Override
    public OrderTotalDto update(Long id, OrderTotalDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public OrderTotalDto getById(Long id) {
        OrderTotal orderTotal = orderTotalRepository.findById(id).orElse(null);
        return mapper.convertToDto(orderTotal);
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!orderTotalRepository.existsById(id)) {
            throw new InvalidDataExeception("The food[id] not found");
        }
        OrderTotal orderTotal = orderTotalRepository.findById(id).get();
        if(orderTotal.getStatus() >= OrderTotalStatus.WAIT_ACCEPT){
            return false;
        }
        log.info(String.format("Someone detele orderTotal[id-%d]", id));
        orderTotalRepository.deleteById(id);
        return true;
    }

    @Override
    public List<OrderTotalDto> getAll() {
        List<OrderTotal> lst = orderTotalRepository.findAll();
        return mapper.convertToListDto(lst);
    }

    @Override
    public List<OrderTotalDto> getAll(Pageable pageable) {
        List<OrderTotal> lst = orderTotalRepository.findAll();
        return mapper.convertToListDto(lst);
    }

    @Override
    public OrderTotal createToCustomer(Customer customer) {
        return null;
    }

    @Override
    public BigDecimal getRevenueBetweenTime(long fromTime, long toTime) {
        List<OrderTotal> orderTotalList = orderTotalRepository.getListOrderTotalBetweenTime(fromTime, toTime, OrderTotalStatus.PAID);
        System.out.println(orderTotalList.size());
        BigDecimal total = new BigDecimal(0);
        for(OrderTotal orderTotal: orderTotalList){
            total = total.add(orderTotal.getAmountTotal());
        }
        return total;
    }

}
