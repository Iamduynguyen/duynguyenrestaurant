package com.restarant.backend.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class CustomerDto {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String gender;
    private AccountDto account;
    private Set<FoodDetailsDto> favouriteFood;
}
