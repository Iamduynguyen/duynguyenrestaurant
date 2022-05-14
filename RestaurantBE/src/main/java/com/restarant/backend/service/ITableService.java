package com.restarant.backend.service;

import com.restarant.backend.dto.TableDto;
import com.restarant.backend.model.Pages;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ITableService extends IServiceAdapter<TableDto>{
    Pages getPage(Pageable pageable);

    List<TableDto> getAllTableAvailable(Pageable pageable, Long timestamp);

    boolean isAvailable(Long tableId, Long timestamp);

    List<TableDto> getbytime(Long start,Long end);

    List<TableDto> findAllTablesExist();
}
