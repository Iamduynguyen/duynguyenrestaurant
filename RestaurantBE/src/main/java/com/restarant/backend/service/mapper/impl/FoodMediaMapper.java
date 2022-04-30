package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.FoodMediaDto;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.entity.FoodMedia;
import com.restarant.backend.model.MediaType;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class FoodMediaMapper extends AbstractDtoMapperAdapter<FoodMedia, FoodMediaDto> {

    public FoodMediaMapper(Class<FoodMedia> classParameter, Class<FoodMediaDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }

    @Override
    public FoodMediaDto convertToDto(FoodMedia entity) {
        FoodMediaDto dto = super.convertToDto(entity);
        if (dto == null) {
            return null;
        }
        dto.setFoodDetailId(entity.getFoodDetalls().getId());
        return dto;
    }

    @Override
    public FoodMedia convertToEntity(FoodMediaDto dto) {
        FoodMedia foodMedia = super.convertToEntity(dto);

        if (foodMedia == null) {
            return null;
        }

        if (dto.getFoodType() == null && dto.getFoodUrl() != null) {
            foodMedia.setFoodType(
                    MediaType.getMediaType(dto.getFoodUrl()).getType()
            );
        }

        if (dto != null && dto.getFoodDetailId() != null) {
            FoodDetails foodDetails = new FoodDetails();
            foodDetails.setId(dto.getFoodDetailId());
            foodMedia.setFoodDetalls(foodDetails);
        }
        return foodMedia;
    }
}
