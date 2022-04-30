package com.restarant.backend.service.validate;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

public class FoodDetailValidator {
    public void validate(FoodDetailsDto foodDetailsDto) throws InvalidDataExeception {
        if(foodDetailsDto == null){
            throw new InvalidDataExeception("foodDetailsDto must not null");
        }
        if(foodDetailsDto.getFoodId() == null){
            throw new InvalidDataExeception("FoodDetailsDto[foodID] must not null");
        }
    }
}
