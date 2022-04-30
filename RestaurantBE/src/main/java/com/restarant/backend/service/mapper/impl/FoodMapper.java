package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.entity.Food;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.entity.FoodMedia;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

import java.util.Collection;
import java.util.List;

public class FoodMapper extends AbstractDtoMapperAdapter<Food, FoodDto> {

    public FoodMapper(Class<Food> classParameter, Class<FoodDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }

    @Override
    public FoodDto convertToDto(Food entity) {
        FoodDto dto = super.convertToDto(entity);
        List<FoodDetails> foodDetails = entity.getFoodDetails();
        dto.setCountDetail(foodDetails.size());
        if (foodDetails.size()>0){
            List<FoodMedia> foodMedia =foodDetails.get(0).getFoodMedias();
            dto.setAvtUrl(foodMedia.get(0).getFoodurl());
        }
        return super.convertToDto(entity);
    }

    @Override
    public Food convertToEntity(FoodDto dto) {
        return super.convertToEntity(dto);
    }

    @Override
    public List<FoodDto> convertToListDto(Collection<Food> collection) {
        return super.convertToListDto(collection);
    }

    @Override
    public List<Food> convertToListEntity(Collection<FoodDto> collection) {
        return super.convertToListEntity(collection);
    }
}
