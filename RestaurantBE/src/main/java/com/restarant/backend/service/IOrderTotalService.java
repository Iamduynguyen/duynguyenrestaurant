package com.restarant.backend.service;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderTotal;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;

public interface IOrderTotalService extends IServiceAdapter<OrderTotalDto> {
    String registrationOrderCounter (OrderCouterDto orderCouterDto, HttpServletRequest request);

    String addFoodTable(TableCounterDto counterDto);

    String confirmCustomerOrderOnline(Long id);

    String deleteOrderDetails(List<Long> ids);

    String confirmOrderOnline(Long id,HttpServletRequest request);

    String confirmDepositOnline(ConfirmDepositOnline request);

    String cancelOrder(Long id);

    String editOrderDetails(EditOrderDetailsRequest request);

    String payment(OrderPaymentDto paymentDto, HttpServletRequest request);

    OrderTotal createToCustomer(Customer customer);
    BigDecimal getRevenueBetweenTime(long fromTime, long toTime);
}
