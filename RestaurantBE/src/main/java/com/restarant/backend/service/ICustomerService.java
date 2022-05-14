package com.restarant.backend.service;

import com.restarant.backend.dto.FavouriteFoodDto;

import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.springframework.data.domain.Pageable;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;

public interface ICustomerService extends IServiceAdapter<CustomerDto>{
    boolean delete(HttpServletRequest request, Long foodDetailId) throws InvalidDataExeception;
    CustomerDto getById(HttpServletRequest request) throws InvalidDataExeception;
  //  List<CustomerDto> getAll(Pageable pageable);

    CustomerDto addFavouriteFood(HttpServletRequest request, FavouriteFoodDto dto) throws InvalidDataExeception;
}
