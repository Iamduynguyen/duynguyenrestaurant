package com.restarant.backend.service;

import com.restarant.backend.dto.OrderCouterDto;
import com.restarant.backend.dto.OrderTotalDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderTotal;

import java.math.BigDecimal;
import java.util.List;

public interface IOrderTotalService extends IServiceAdapter<OrderTotalDto> {
    String registrationOrderCounter (OrderCouterDto orderCouterDto);

    OrderTotal createToCustomer(Customer customer);
    BigDecimal getRevenueBetweenTime(long fromTime, long toTime);
}
