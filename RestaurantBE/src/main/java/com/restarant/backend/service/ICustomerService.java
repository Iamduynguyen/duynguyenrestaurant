package com.restarant.backend.service;

import com.restarant.backend.dto.FavouriteFoodDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

import javax.servlet.http.HttpServletRequest;
import java.util.Set;

public interface ICustomerService extends IServiceAdapter<CustomerDto>{
    boolean delete(HttpServletRequest request, Long foodDetailId) throws InvalidDataExeception;
    CustomerDto getById(HttpServletRequest request) throws InvalidDataExeception;
    CustomerDto addFavouriteFood(HttpServletRequest request, FavouriteFoodDto dto) throws InvalidDataExeception;
}
