package com.restarant.backend.config;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.*;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.mapper.impl.*;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationCustomeRegisterBean {

    @Bean
    public ModelMapper getModelMapper(){
        return new ModelMapper();
    }

    @Bean("foodMapper")
    public FoodMapper getFoodMapper(){
        return new FoodMapper(Food.class, FoodDto.class);
    }

    @Bean("categoryMapper")
    public CategoryMapper getCategoryMapper(){
        return new CategoryMapper(Category.class, CategoryDto.class);
    }

    @Bean("foodDetailsMapper")
    public FoodDetailMapper getFoodDetailMapper(){
        return new FoodDetailMapper(FoodDetails.class, FoodDetailsDto.class);
    }

    @Bean("foodMediaMapper")
    public FoodMediaMapper getFoodMediaMapper(){
        return new FoodMediaMapper(FoodMedia.class, FoodMediaDto.class);
    }

    @Bean("tableMapper")
    public TableMapper getTableMapper(){
        return new TableMapper(Tables.class, TableDto.class);
    }

    @Bean("orderDetailsMapper")
    public OrderDetailsMapper getOrderDetailsMapper(){
        return new OrderDetailsMapper(OrderDetails.class, OrderDetailsDto.class);
    }

    @Bean("tableOrderMapper")
    public TableOrderMapper getTableOrderMapper(){
        return new TableOrderMapper(TableOrder.class, TableOrderDto.class);
    }

    @Bean("orderTotalMapper")
    public OrderTotalMapper getOrderTotalMapper(){
        return new OrderTotalMapper(OrderTotal.class, OrderTotalDto.class);
    }

    @Bean("paymentMapper")
    public PaymentMapper getPaymentMapper(){
        return new PaymentMapper(Payment.class, PaymentDto.class);
    }

    @Bean("voucherMapper")
    public VoucherMapper getVoucherMapper(){
        return new VoucherMapper(Voucher.class, VoucherDto.class);
    }

    @Bean("customerMapper")
    public IConverterDto<Customer, CustomerDto> getCustomerMapper(){
        return new CustomerMapper(Customer.class, CustomerDto.class);
    }
    @Bean("feedbackMapper")
    public IConverterDto<Feedback, FeedbackDto> getFeedbackMapper(){
        return new FeedbackMapper(Feedback.class, FeedbackDto.class);
    }
}
