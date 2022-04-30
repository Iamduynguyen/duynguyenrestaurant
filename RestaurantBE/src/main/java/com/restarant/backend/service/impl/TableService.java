package com.restarant.backend.service.impl;

import com.restarant.backend.dto.TableDto;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.model.Pages;
import com.restarant.backend.repository.TableOrderRepository;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.ITableService;
import com.restarant.backend.service.mapper.impl.TableMapper;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalField;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TableService implements ITableService {

    public static final long TIME_EATING = TimeUnit.HOURS.toMillis(5);

    private final TableMapper tableMapper;
    private final TablesRepository tablesRepository;
    private final TableOrderRepository tableOrderRepository;

    public TableService(TableMapper tableMapper,
                        TablesRepository tablesRepository,
                        TableOrderRepository tableOrderRepository) {
        this.tableMapper = tableMapper;
        this.tablesRepository = tablesRepository;
        this.tableOrderRepository = tableOrderRepository;
    }

    @Override
    public TableDto create(TableDto dto) {
        log.info("Someone create table " + dto);

        Tables result = tablesRepository.save(
                tableMapper.convertToEntity(dto)
        );

        return tableMapper.convertToDto(result);
    }

    @Override
    public TableDto update(Long id, TableDto dto) {
        if (tablesRepository.existsById(id)) {

            log.info("Someone edit table id-" + id);
            Tables tables = tableMapper.convertToEntity(dto);
            tables.setId(id);
            return tableMapper.convertToDto(
                    tablesRepository.save(tables)
            );
        }
        return null;
    }

    @Override
    public TableDto getById(Long id) {
        return tableMapper.convertToDto(
                tablesRepository.findById(id).orElse(null)
        );
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!tablesRepository.existsById(id)) {
            throw new InvalidDataExeception("The foodMedia[id] not found");
        }
        if (tablesRepository.findByIdAndStatusIs(id, 0L) == null) {
            throw new InvalidDataExeception("Table are using!");
        }
        log.info("Someone delete table id-" + id);
        tablesRepository.deleteById(id);
        return true;
    }

    @Override
    public List<TableDto> getAll() {
        return tableMapper.convertToListDto(
                tablesRepository.findAll()
        );
    }

    @Override
    public List<TableDto> getAll(Pageable pageable) {
        return tableMapper.convertToListDto(
                tablesRepository.findAll(pageable).getContent()
        );
    }

    @Override
    public Pages getPage(Pageable pageable) {
        return new Pages(tablesRepository.findAll(pageable));
    }

    @Override
    public List<TableDto> getAllTableAvailable(Pageable pageable, Long userOrderTime) {
        List<Tables> tables = tablesRepository.findAll();
        List<Tables> result = tables.stream()
                .filter(table -> isAvailable(table.getId(), userOrderTime))
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = (int) ((start + pageable.getPageSize()) > result.size() ? result.size()
                : (start + pageable.getPageSize()));

        return tableMapper.convertToListDto(result.subList(start, end));
    }

    @Override
    public boolean isAvailable(Long tableId, Long userOrderTime) {
        Tables tables = tablesRepository.findById(tableId).orElse(null);
        if (tables == null) {
            return false;
        }
        List<TableOrder> tableOrders = tableOrderRepository.getAllByTableId(tableId);

        return tableOrders.stream()
                .filter(tableOrder -> tableOrder.getOrderTotal() != null)
                .map(tableOrder -> tableOrder.getOrderTotal().getOrderTime())
                .filter(orderTime -> orderTime != null)
                .noneMatch(orderTime -> orderTime >= userOrderTime - TIME_EATING
                        && orderTime <= userOrderTime + TIME_EATING);
    }



}
