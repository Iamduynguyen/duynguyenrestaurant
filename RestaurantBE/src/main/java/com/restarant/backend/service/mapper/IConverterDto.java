package com.restarant.backend.service.mapper;

import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.entity.TableOrder;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface IConverterDto<T1, T2> {
    T2 convertToDto(T1 entity);

    T1 convertToEntity(T2 dto);

    List<T2> convertToListDto(Collection<T1> collection);

    List<T1> convertToListEntity(Collection<T2> collection);
}
