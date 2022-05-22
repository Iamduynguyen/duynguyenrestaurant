package com.restarant.backend.service;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

public interface IOrderTotalService extends IServiceAdapter<OrderTotalDto> {
    String confirmCustomerGoRestaurant(Long id) throws InvalidDataExeception;

    List<GetAllToTalOrder> getAllOrderTotal();

    String paymentVnpay(HttpServletRequest request, Long toTalOrderid) throws IOException;

    String checkOutVnpay(String bankStatus, String bankTransactionId);

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

    List<OrderHistoryDto> getHistoryOrder(Long customerId);

    List<OrderHistoryDetailDto> getOrderDetailsByOrderId(Long orderId);
}
