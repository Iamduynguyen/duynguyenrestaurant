package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.CategoryDto;
import com.restarant.backend.entity.Category;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class CategoryMapper extends AbstractDtoMapperAdapter<Category, CategoryDto> {

    public CategoryMapper(Class<Category> classParameter, Class<CategoryDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
}
