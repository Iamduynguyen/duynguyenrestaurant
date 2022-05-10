package com.restarant.backend.web.controller;

import com.restarant.backend.dto.TableDto;
import com.restarant.backend.dto.TimeDto;
import com.restarant.backend.entity.Tables;
import com.restarant.backend.model.Pages;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.ITableService;
import com.restarant.backend.service.utils.ConvertTime;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class TablesController {

    private final Logger log = LoggerFactory.getLogger(TablesController.class);

    private static final String ENTITY_NAME = "tables";
    @Autowired
    ConvertTime convertTime;


    private final ITableService tableService;

    public TablesController(ITableService tableService) {
        this.tableService = tableService;
    }

    /**
     * {@code POST  /tables} : Create a new tables.
     *
     * @param tables the tables to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tables, or with status {@code 400 (Bad Request)} if the tables has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tables")
    public ResponseEntity<?> createTables(@RequestBody TableDto dto) {
        log.debug("REST request to save Tables : {}", dto);
        try {
            TableDto result = tableService.create(dto);
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when create Table", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * {@code PUT  /tables/:id} : Updates an existing tables.
     *
     * @param id the id of the tables to save.
     * @param tables the tables to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tables,
     * or with status {@code 400 (Bad Request)} if the tables is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tables couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tables/{id}")
    public ResponseEntity<?> updateTables(@PathVariable(value = "id", required = false) final Long id,
                                          @RequestBody TableDto tableDto)
        throws URISyntaxException {
        log.debug("REST request to update Tables : {}, {}", id, tableDto);

        try {
            TableDto result = tableService.update(id, tableDto);
            if(result == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update Table", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * {@code GET  /tables} : get all the tables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tables in body.
     */
    @GetMapping("/tables")
    public List<TableDto> getAllTables(@RequestParam Long start,@RequestParam Long end) {
        log.debug("REST request to get all Tables");
        Long start1;
        start1 = convertTime.validate(start);
        if (end==start){
            end = convertTime.addHour(start,3l);
        }else {
            end = convertTime.validate(end);
        }
        return tableService.getbytime(start1,end);
    }

    /**
     * {@code GET  /tables/:id} : get the "id" tables.
     *
     * @param id the id of the tables to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tables, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tables/{id}")
    public ResponseEntity<TableDto> getTables(@PathVariable Long id) {
        log.debug("REST request to get Tables : {}", id);
        TableDto result = tableService.getById(id);
        if(result == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * {@code DELETE  /tables/:id} : delete the "id" tables.
     *
     * @param id the id of the tables to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tables/{id}")
    public ResponseEntity<?> deleteTables(@PathVariable Long id) {
        log.debug("REST request to delete Food : {}", id);
        try {
            if(tableService.deleteById(id)){
                return ResponseEntity.ok().body("Delete success!");
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when ddelete table", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/tables/pages")
    public ResponseEntity<Pages> getPages(Pageable pageable){
        return ResponseEntity.ok(tableService.getPage(pageable));
    }
}
