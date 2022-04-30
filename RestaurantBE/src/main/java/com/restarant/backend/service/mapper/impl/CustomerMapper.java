package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class CustomerMapper extends AbstractDtoMapperAdapter<Customer, CustomerDto> {
    public CustomerMapper(Class<Customer> classParameter, Class<CustomerDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
}
