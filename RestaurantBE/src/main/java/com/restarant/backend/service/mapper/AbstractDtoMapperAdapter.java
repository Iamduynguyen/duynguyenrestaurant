package com.restarant.backend.service.mapper;

import org.modelmapper.ModelMapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class AbstractDtoMapperAdapter<T1, T2> implements IConverterDto<T1, T2> {

    private final ModelMapper modelMapper;
    private Class<T1> classParameter;
    private Class<T2> classDtoParameter;

    public AbstractDtoMapperAdapter(Class<T1> classParameter, Class<T2> classDtoParameter) {
        this.modelMapper = new ModelMapper();
        this.classParameter = classParameter;
        this.classDtoParameter = classDtoParameter;
    }

    @Override
    public T2 convertToDto(T1 entity) {
        return entity == null? null : (T2) modelMapper.map(entity, classDtoParameter);
    }

    @Override
    public T1 convertToEntity(T2 dto) {
        return dto == null? null : (T1) modelMapper.map(dto, classParameter);
    }

    @Override
    public List<T2> convertToListDto(Collection<T1> collection) {
        return collection.stream()
                .map(element -> convertToDto(element))
                .collect(Collectors.toList());
    }

    @Override
    public List<T1> convertToListEntity(Collection<T2> collection) {
        return collection.stream()
                .map(element -> convertToEntity(element))
                .collect(Collectors.toList());
    }


}
