package com.restarant.backend.service.impl;

import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.model.OrderTotalStatus;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.repository.TableOrderRepository;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.ITableOrderService;
import com.restarant.backend.service.ITableService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.utils.ConvertTime;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TableOrderService implements ITableOrderService {

    private final TableOrderRepository tableOrderRepository;
    private final IConverterDto<TableOrder, TableOrderDto> mapper;
    private final OrderTotalRepository orderTotalRepository;
    private final ITableService tableService;
    private final TablesRepository tablesRepository;
    private final JwtServiceUtils jwtServiceUtils;
    @Autowired
    ConvertTime convertTime;

    public TableOrderService(TableOrderRepository tableOrderRepository,
                             @Qualifier("tableOrderMapper") IConverterDto<TableOrder, TableOrderDto> mapper,
                             OrderTotalRepository orderTotalRepository,
                             ITableService tableService, TablesRepository tablesRepository, JwtServiceUtils jwtServiceUtils) {
        this.tableOrderRepository = tableOrderRepository;
        this.mapper = mapper;
        this.orderTotalRepository = orderTotalRepository;
        this.tableService = tableService;
        this.tablesRepository = tablesRepository;
        this.jwtServiceUtils = jwtServiceUtils;
    }

    @Override
    public TableOrderDto create(TableOrderDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public TableOrderDto create(TableOrderDto dto, HttpServletRequest request) throws InvalidDataExeception {
        if(dto.getTableId() == null){
            throw new InvalidDataExeception("id must not null");
        }
        if(dto.getOrderTime() == null){
            throw new InvalidDataExeception("require field[order_time]");
        }
        if(!tableService.isAvailable(dto.getTableId(), dto.getOrderTime())){
            throw new InvalidDataExeception("Table are using!");
        }

        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        if(customer == null){
            throw new InvalidDataExeception("user not login");
        }
        // create Order Total
        OrderTotal orderTotal = orderTotalRepository.getOrderTotalByCustomerId(customer.getId());

        if(orderTotal == null){
            OrderTotal newOrderTotal = new OrderTotal();
            newOrderTotal.setCustomer(customer);
            Long start = convertTime.validate(dto.getOrderTime());
            Long end =0l;
            if (dto.getEndTime()==null){
                end = convertTime.addHour(start,3l);
            }else {
                end = convertTime.validate(dto.getEndTime());
            }
            newOrderTotal.setOrderTime(start);
            newOrderTotal.setEndTime(end);
            newOrderTotal.setAmountTotal(new BigDecimal("0"));
            newOrderTotal.setStatus(OrderTotalStatus.ORDERING);
            orderTotal = orderTotalRepository.save(newOrderTotal);
        }

        if(orderTotal == null){
            return null;
        }

        dto.setOrderTotalId(orderTotal.getId());
        TableOrder tableOrder = mapper.convertToEntity(dto);
        TableOrder result = tableOrderRepository.save(tableOrder);

        Tables tables = new Tables();
        tables.setId(result.getTables().getId());
        //tables.setStatus(1L);
        tablesRepository.save(tables);

        return mapper.convertToDto(result);

    }

    @Override
    public List<TableOrderDto> getTableOrderByCustomerId(HttpServletRequest request) {
        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        List<TableOrder> result = new ArrayList<>();
        if(customer != null && customer.getId() != null){
            OrderTotal orderTotal = orderTotalRepository.getOrderTotalByCustomerId(customer.getId());
            if(orderTotal != null){
                result.addAll(orderTotal.getTableOrders());
            }
        }
        return mapper.convertToListDto(result);
    }

    @Override
    public TableOrderDto getTableOrderingByTableId(long tableId, Long queryTime) {
        if(queryTime == null){
            queryTime = System.currentTimeMillis();
        }
        TableOrder tableOrder = tableOrderRepository
                .getByOrderTimeAndTableId(
                        tableId,
                        queryTime - TableService.TIME_EATING,
                        queryTime + TableService.TIME_EATING);
        return mapper.convertToDto(tableOrder);
    }



    @Override
    public TableOrderDto update(Long id, TableOrderDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public TableOrderDto getById(Long id) {
        return mapper.convertToDto(
                tableOrderRepository.findById(id).orElse(null));
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!tableOrderRepository.existsById(id)) {
            throw new InvalidDataExeception("The orderDetail[id] not found");
        }
        TableOrder tableOrder = tableOrderRepository.findById(id).orElse(null);
        if(tableOrder.getOrderTotal() != null && tableOrder.getOrderTotal().getStatus() != OrderTotalStatus.ORDERING){
            throw new InvalidDataExeception("Cant delete because the order is accepted");
        }

        log.info("Someone delete category id-" + id);
        tableOrderRepository.deleteById(id);
        return true;
    }

    @Override
    public List<TableOrderDto> getAll() {
        return null;
    }

    @Override
    public List<TableOrderDto> getAll(Pageable pageable) {
        return mapper.convertToListDto(
                tableOrderRepository.findAll(pageable).getContent());
    }

}
