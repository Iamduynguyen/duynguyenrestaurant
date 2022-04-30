package com.restarant.backend.service.validate;

import com.restarant.backend.entity.Customer;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

public class CustomerValidator {
    public void validate(Customer customer) throws InvalidDataExeception {
        if(customer.getEmail() == null){
            throw new InvalidDataExeception("Customer require Email");
        }
        if(customer.getPhoneNumber() == null){
            throw new InvalidDataExeception("Customer require Phone number");
        }
        if(customer.getName() == null){
            throw new InvalidDataExeception("Customer require name");
        }
    }
}
