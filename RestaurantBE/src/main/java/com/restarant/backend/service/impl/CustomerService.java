package com.restarant.backend.service.impl;

import com.restarant.backend.dto.FavouriteFoodDto;
import com.restarant.backend.entity.Account;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.repository.AccountRepository;
import com.restarant.backend.repository.CustomerRepository;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.service.ICustomerService;
import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.validate.CustomerValidator;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerService implements ICustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final CustomerValidator customerValidate;
    private final FoodDetallsRepository foodDetallsRepository;
    private final IConverterDto<Customer, CustomerDto> mapper;
    private final JwtServiceUtils jwtServiceUtils;


    public CustomerService(CustomerRepository customerRepository,
                           AccountRepository accountRepository, FoodDetallsRepository foodDetallsRepository,
                           @Qualifier("customerMapper") IConverterDto<Customer, CustomerDto> mapper,
                           JwtServiceUtils jwtServiceUtils) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.foodDetallsRepository = foodDetallsRepository;
        this.mapper = mapper;
        this.jwtServiceUtils = jwtServiceUtils;
        customerValidate = new CustomerValidator();
    }


    @Override
    public CustomerDto create(CustomerDto dto) throws InvalidDataExeception {
        if (dto != null) {
            Customer result = customerRepository.save(
                    mapper.convertToEntity(dto)
            );
            return mapper.convertToDto(result);
        }
        return null;
    }

    @Override
    public CustomerDto update(Long id, CustomerDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public CustomerDto getById(Long id) {
        return mapper.convertToDto(
                customerRepository.findById(id).orElse(null)
        );
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        Customer customer = customerRepository.getById(id);
        Account account = customer.getAccount();
        account.setDeleteFlag(true);
        customer.setDeleteflag(Long.valueOf("1"));
        customerRepository.save(customer);
        accountRepository.save(account);
        return false;
    }

    @Override
    public List<CustomerDto> getAll() {
        return null;
    }

    @Override
    public List<CustomerDto> getAll(Pageable pageable) {
        return null;
    }

    @Override
    public boolean delete(HttpServletRequest request, Long foodDetailId) throws InvalidDataExeception {
        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        if(customer == null){
            throw new InvalidDataExeception("user not login");
        }
        Set<FoodDetails> afterDelete = customer.getFavouriteFood()
                .stream()
                .filter(foodDetails -> !foodDetails.getId().equals(foodDetailId))
                .collect(Collectors.toSet());

        customer.setFavouriteFood(afterDelete);
        customerRepository.save(customer);
        return true;
    }

    @Override
    public CustomerDto getById(HttpServletRequest request) throws InvalidDataExeception {
        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        if(customer == null){
            throw new InvalidDataExeception("user not login");
        }
        return mapper.convertToDto(customer);
    }

    @Override
    public CustomerDto addFavouriteFood(HttpServletRequest request, FavouriteFoodDto dto) throws InvalidDataExeception {
        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        System.out.println(customerRepository.findById(1L).orElse(null).getFavouriteFood().size());
        if (customer == null) {
            throw new InvalidDataExeception("User not login!");
        }
        if (dto.getFoodDetailId() == null) {
            throw new InvalidDataExeception("food-detail[id] required");
        }
        FoodDetails foodDetails = foodDetallsRepository
                .findById(dto.getFoodDetailId())
                .orElse(null);

        if (foodDetails == null) {
            throw new InvalidDataExeception("food-detail[id] not exists");
        }

        customer.getFavouriteFood().add(foodDetails);
        return mapper.convertToDto(
                customerRepository.save(customer)
        );

    }

    @Override
    public List<Customer> getAllCustomer() {
        return customerRepository.findAll();
    }
}
