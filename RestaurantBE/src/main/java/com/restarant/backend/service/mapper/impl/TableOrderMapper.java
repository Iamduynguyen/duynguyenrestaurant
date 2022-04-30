package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.repository.OrderDetailsRepository;
import com.restarant.backend.repository.TableOrderRepository;
import com.restarant.backend.service.ITableOrderService;
import com.restarant.backend.service.ITableService;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;
import org.springframework.beans.factory.annotation.Autowired;

public class TableOrderMapper extends AbstractDtoMapperAdapter<TableOrder, TableOrderDto> {
    public TableOrderMapper(Class<TableOrder> classParameter, Class<TableOrderDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
    @Autowired
    OrderDetailsRepository orderDetailsRepository;
    @Autowired
    OrderDetailsMapper orderDetailsMapper;

    @Override
    public TableOrder convertToEntity(TableOrderDto dto) {
        TableOrder tableOrder = super.convertToEntity(dto);
        if (tableOrder != null) {
            OrderTotal orderTotal = new OrderTotal();
            orderTotal.setId(dto.getOrderTotalId());
            tableOrder.setOrderTotal(orderTotal);

            Tables tables = new Tables();
            tables.setId(dto.getTableId());
            tableOrder.setTables(tables);
        }

        return tableOrder;
    }

    @Override
    public TableOrderDto convertToDto(TableOrder entity) {
        TableOrderDto tableOrderDto = super.convertToDto(entity);
        if (tableOrderDto != null && entity.getTables() != null) {
            tableOrderDto.setTableId(entity.getTables().getId());
        }
        if (tableOrderDto != null && entity.getOrderTotal() != null) {
            tableOrderDto.setOrderTotalId(entity.getOrderTotal().getId());
        }
        tableOrderDto.setOrderDetails(orderDetailsMapper.convertToListDto(orderDetailsRepository.getByTableorde(entity)));
        return tableOrderDto;
    }
}
