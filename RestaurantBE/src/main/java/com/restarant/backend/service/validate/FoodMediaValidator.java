package com.restarant.backend.service.validate;

import com.restarant.backend.dto.FoodMediaDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

public class FoodMediaValidator {
    public void validate(FoodMediaDto foodMediaDto) throws InvalidDataExeception {
        if(foodMediaDto == null){
            throw new InvalidDataExeception("FoodMediaDto must not null");
        }
        if(foodMediaDto.getFoodDetailId() == null){
            throw new InvalidDataExeception("FoodDetailId must not null");
        }
    }
}
