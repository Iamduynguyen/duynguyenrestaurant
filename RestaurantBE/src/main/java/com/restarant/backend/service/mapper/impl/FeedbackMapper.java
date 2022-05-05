package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.dto.FeedbackDto;
import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.entity.*;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

import java.util.List;

public class FeedbackMapper extends AbstractDtoMapperAdapter<Feedback, FeedbackDto> {
    public FeedbackMapper(Class<Feedback> classParameter, Class<FeedbackDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }


}
