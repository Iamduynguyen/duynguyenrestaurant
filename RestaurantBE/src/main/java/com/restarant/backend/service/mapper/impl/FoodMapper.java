package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.entity.Food;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.entity.FoodMedia;
import com.restarant.backend.service.impl.FoodDetailService;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;
import com.restarant.backend.service.mapper.IConverterDto;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;

public class FoodMapper extends AbstractDtoMapperAdapter<Food, FoodDto> {
    @Autowired
    IConverterDto<FoodDetails, FoodDetailsDto> foodDetailMapper;

    public FoodMapper(Class<Food> classParameter, Class<FoodDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }

    @Override
    public FoodDto convertToDto(Food entity) {
        FoodDto dto = super.convertToDto(entity);
        List<FoodDetails> foodDetails = entity.getFoodDetails();
        if (foodDetails!=null){
            dto.setCountDetail(foodDetails.size());
        }else {
            dto.setCountDetail(0);
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
