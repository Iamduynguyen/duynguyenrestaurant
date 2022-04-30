package com.restarant.backend.service;

import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface ITableOrderService extends IServiceAdapter<TableOrderDto> {
    TableOrderDto create(TableOrderDto dto, HttpServletRequest request) throws InvalidDataExeception;

    List<TableOrderDto> getTableOrderByCustomerId(HttpServletRequest request);

    TableOrderDto getTableOrderingByTableId(long tableId, Long queryTime);
}
