package com.restarant.backend.service.impl;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.*;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.repository.*;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
public class OrderTotalService implements IOrderTotalService {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
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
    public String registrationOrderCounter(OrderCouterDto orderCouterDto){
        try {
            Date now = new Date();
            OrderTotal orderTotal = new OrderTotal();
            orderTotal.setCreatedAt(now.getTime());
            orderTotal.setOrderTime(now.getTime());
            orderTotal.setStatus(5);
            Staff staff = new Staff();
            staff.setId(1L);
            orderTotal.setStaff(staff);
//        orderTotal.setDeleteflag();
            if (orderCouterDto.getTableCounterDtos().isEmpty()) {
                return "FAIL";
            }
            OrderTotal orderTotalSave = orderTotalRepository.save(orderTotal);
            OrderDetails orderDetails = new OrderDetails();
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            Tables tables = new Tables();
            FoodDetails foodDetails = new FoodDetails();
            for (TableCounterDto tableCounterDto : orderCouterDto.getTableCounterDtos()) {
                TableOrder tableOrder = new TableOrder();
                tables.setId(tableCounterDto.getTableId());
                tableOrder.setTables(tables);
                tableOrder.setOrderTotal(orderTotalSave);
                tableOrder = tableOrderRepository.save(tableOrder);
                for (FoodCouter foodCouter : tableCounterDto.getIdFoodCounters()) {
                    orderDetails.setTableOrder(tableOrder);
                    orderDetails.setQuantity((long) foodCouter.getQuantity());
                    foodDetails.setId(foodCouter.getFoodId());
                    orderDetails.setFoodDetalls(foodDetails);
                    orderDetailsList.add(orderDetails);
                }
                orderDetailsRepository.saveAll(orderDetailsList);
            }
        }catch (Exception e){
            e.printStackTrace();
            return "FAIL";
        }
        return "SUCCESS";

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
