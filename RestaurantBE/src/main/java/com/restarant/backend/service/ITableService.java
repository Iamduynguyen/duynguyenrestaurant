package com.restarant.backend.service;

import com.restarant.backend.dto.TableDto;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.model.Pages;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface ITableService extends IServiceAdapter<TableDto>{
    Pages getPage(Pageable pageable);

    List<TableDto> getAllTableAvailable(Pageable pageable, Long timestamp);

    boolean isAvailable(Long tableId, Long timestamp);
}
