package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.OrderDetailsDto;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class OrderDetailsMapper extends AbstractDtoMapperAdapter<OrderDetails, OrderDetailsDto> {
    public OrderDetailsMapper(Class<OrderDetails> classParameter, Class<OrderDetailsDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }

    @Override
    public OrderDetailsDto convertToDto(OrderDetails entity) {
        OrderDetailsDto dto = super.convertToDto(entity);
        if(dto != null){
            dto.setTableOrderId(entity.getTableOrder().getId());
        }
        if (entity.getStatus()==0){
            dto.setStatus("Vừa thêm vào");
        }
        if (entity.getStatus()==1){
            dto.setStatus("chờ xác nhận");
        }
        if (entity.getStatus()==2){
            dto.setStatus("Đã xác nhận");
        }
        if (entity.getStatus()==3){
            dto.setStatus("Sắp mang ra");
        }
        if (entity.getStatus()==4){
            dto.setStatus("Đang ăn");
        }
        if (entity.getStatus()==6){
            dto.setStatus("Đã thanh toán");
        }
        if (entity.getStatus()==7){
            dto.setStatus("Nhà hàng hủy");
        }
        return dto;
    }

    @Override
    public OrderDetails convertToEntity(OrderDetailsDto dto) {
        OrderDetails orderDetails = super.convertToEntity(dto);
        if(orderDetails != null && dto != null && dto.getTableOrderId() != null){
            TableOrder tableOrder = new TableOrder();
            tableOrder.setId(dto.getTableOrderId());
            orderDetails.setTableOrder(tableOrder);
        }
        return orderDetails;
    }
}
