package com.restarant.backend.web.controller;

import com.restarant.backend.dto.OrderDetailsDto;
import com.restarant.backend.dto.TableOrderDto;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.repository.OrderDetailsRepository;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.repository.TableOrderRepository;
import com.restarant.backend.repository.TablesRepository;
import com.restarant.backend.service.ITableOrderService;
import com.restarant.backend.service.impl.OrderTotalService;
import com.restarant.backend.service.impl.TableOrderService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@Transactional
public class TableOrderController {

    private final Logger log = LoggerFactory.getLogger(TableOrderController.class);

    private static final String ENTITY_NAME = "tableOrder";

    private final ITableOrderService tableOrderService;
    @Autowired
    OrderTotalRepository orderTotalRepository;

    @Autowired
    TableOrderRepository tablesRepository;

    @Autowired
    OrderTotalService orderTotalService;

    @Autowired
    OrderDetailsRepository orderDetailsRepository;

    public TableOrderController(ITableOrderService tableOrderService) {
        this.tableOrderService = tableOrderService;
    }

    /**
     * {@code POST  /table-orders} : Create a new tableOrder.
     *
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tableOrder, or with status {@code 400 (Bad Request)} if the tableOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/table-orders")
    public ResponseEntity<?> createTableOrder(@RequestBody List<TableOrderDto> dto, HttpServletRequest request) {
        log.debug("REST request to save TableOrder : {}", dto);
        if (dto==null){
            return ResponseEntity.badRequest().body("chua chon ban");
        }

        for (TableOrderDto x:dto){
            System.out.println(x.toString());
            if (x.getOrderTime()==null||x.getEndTime()==null){
                return ResponseEntity.badRequest().body(4);
            }
        }
        List<TableOrderDto> result = new ArrayList<>();
        for (TableOrderDto tableOrderDto : dto) {
            try {
                result.add(tableOrderService.create(tableOrderDto, request));
            } catch (InvalidDataExeception e) {
                log.error("Error when create table-order", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("table-orders/customer")
    public ResponseEntity<?> getTableOrderByCustomer(HttpServletRequest request){
        return ResponseEntity.ok(tableOrderService.getTableOrderByCustomerId(request));
    }

    @GetMapping("table-orders/table/{tableId}")
    public ResponseEntity<?> getTableOrdering(@PathVariable("tableId") long id,
                                              @RequestParam(value = "query_time", required = false) Long queryTime){
        return ResponseEntity.ok(tableOrderService.getTableOrderingByTableId(id, queryTime));
    }

//    /**
//     * {@code PUT  /table-orders/:id} : Updates an existing tableOrder.
//     *
//     * @param id         the id of the tableOrder to save.
//     * @param tableOrder the tableOrder to update.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tableOrder,
//     * or with status {@code 400 (Bad Request)} if the tableOrder is not valid,
//     * or with status {@code 500 (Internal Server Error)} if the tableOrder couldn't be updated.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PutMapping("/table-orders/{id}")
//    public ResponseEntity<?> updateTableOrder(
//        @PathVariable(value = "id", required = false) final Long id,
//        @RequestBody TableOrder tableOrder
//    ) throws URISyntaxException {
//        log.debug("REST request to update TableOrder : {}, {}", id, tableOrder);
//
//        if (!tableOrderRepository.existsById(id)) {
//            return ResponseEntity.badRequest().body("entity not found");
//        }
//
//        TableOrder result = tableOrderRepository.save(tableOrder);
//        return ResponseEntity.ok().body(result);
//    }
//
//    /**
//     * {@code GET  /table-orders} : get all the tableOrders.
//     *
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tableOrders in body.
//     */
    @GetMapping("/table-orders")
    public List<TableOrderDto> getAllTableOrders(Pageable pageable) {
        log.debug("REST request to get all TableOrders");
        return (List<TableOrderDto>) tableOrderService.getAll(pageable);
    }


    //
//    /**
//     * {@code GET  /table-orders/:id} : get the "id" tableOrder.
//     *
//     * @param id the id of the tableOrder to retrieve.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tableOrder, or with status {@code 404 (Not Found)}.
//     */
    @GetMapping("/table-orders/{id}")
    public ResponseEntity<?> getTableOrder(@PathVariable Long id) {
        log.debug("REST request to get TableOrder : {}", id);
        TableOrderDto result = tableOrderService.getById(id);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(result);
    }

    //
//    /**
//     * {@code DELETE  /table-orders/:id} : delete the "id" tableOrder.
//     *
//     * @param id the id of the tableOrder to delete.
//     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
//     */
    @DeleteMapping("/table-orders/{id}")
    public ResponseEntity<?> deleteTableOrder(@PathVariable Long id) {
        TableOrder tableOrder = tablesRepository.findById(id).get();
        OrderTotal orderTotal = tableOrder.getOrderTotal();
        try {
                orderTotalRepository.deleteById(id);
                List<OrderDetails> orderDetails = orderDetailsRepository.getByOrderTableId(id);
                orderDetailsRepository.deleteAll(orderDetails);
                orderTotalService.tinhtongtien(orderTotal);
                return ResponseEntity.ok("SUCCESS");
        } catch (Exception e) {
            log.error("Error when ddelete table", e);
            return ResponseEntity.ok("FAIL");
        }
    }
}
