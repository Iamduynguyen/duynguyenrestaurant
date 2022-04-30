package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class FoodDetailMapper extends AbstractDtoMapperAdapter<FoodDetails, FoodDetailsDto> {

    public FoodDetailMapper(Class<FoodDetails> classParameter, Class<FoodDetailsDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }

    @Override
    public FoodDetailsDto convertToDto(FoodDetails entity) {
        FoodDetailsDto result = super.convertToDto(entity);
        if(result == null || entity == null){
            return null;
        }
        result.setFoodId(entity.getFood().getId());
        result.setFoodName(entity.getFood().getName());
        return result;
    }
}
