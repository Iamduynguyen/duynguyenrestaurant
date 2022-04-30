package com.restarant.backend.service.mapper.impl;

import com.restarant.backend.dto.TableDto;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.service.mapper.AbstractDtoMapperAdapter;

public class TableMapper extends AbstractDtoMapperAdapter<Tables, TableDto> {
    public TableMapper(Class<Tables> classParameter, Class<TableDto> classDtoParameter) {
        super(classParameter, classDtoParameter);
    }
}
