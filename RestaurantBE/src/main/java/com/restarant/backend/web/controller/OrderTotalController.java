package com.restarant.backend.web.controller;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.impl.OrderTotalService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api")
//@Transactional
@CrossOrigin("*")
public class OrderTotalController {

    @Autowired
    private OrderTotalRepository orderTotalRepository;

    private final Logger log = LoggerFactory.getLogger(OrderTotalController.class);

    private static final String ENTITY_NAME = "orderTotal";

    private final IOrderTotalService orderTotalService;

    @Autowired
    OrderTotalService orderTotalService1;

    public OrderTotalController(IOrderTotalService orderTotalService) {
        this.orderTotalService = orderTotalService;
    }

    @GetMapping("/orders")
    public List<GetAllToTalOrder> getAllToTalOrders(){
        return orderTotalService.getAllOrderTotal();
    }

    @GetMapping("/orders1")
    public List<OrderTotal> getAllOrders() {
        return orderTotalRepository.findAll();
    }


    @PutMapping("/confirm-customer-order-online/{id}")
    public String confirmCustomerOrderOnline(@PathVariable Long id){
        return orderTotalService.confirmCustomerOrderOnline(id);
    }

    @PostMapping("/create-order-couter")
    public String createCounter(@RequestBody OrderCouterDto request, HttpServletRequest httpServletRequest) {
        return orderTotalService.registrationOrderCounter(request, httpServletRequest);
    }

    @PostMapping("/payment-order")
    public String payment(@RequestBody OrderPaymentDto paymentDto, HttpServletRequest request) {
        return orderTotalService.payment(paymentDto, request);
    }

    @PostMapping("/add-order-details")
    public String addOrderDetails(@RequestBody TableCounterDto tableCounterDto) {
        return orderTotalService.addFoodTable(tableCounterDto);
    }

    @PostMapping("/delete-all-details-ids")
    public String deleteAllDetailsIds(@RequestBody DeleteAllOrderDetailsById detailsById) {
        return orderTotalService.deleteOrderDetails(detailsById.getIds());
    }

    @PostMapping("/edit-order-details")
    public String editOrderDetails(@RequestBody EditOrderDetailsRequest request) {
        return orderTotalService.editOrderDetails(request);
    }

    @PutMapping("/confirm-order-online/{id}")
    public String confirmOrderOnline(@PathVariable Long id,HttpServletRequest request){
        return orderTotalService.confirmOrderOnline(id,request);
    }
    @PostMapping("/confirm-deposit-online")
    public String confirmDepositOnline(@RequestBody ConfirmDepositOnline request){
        return orderTotalService.confirmDepositOnline(request);
    }
    @PutMapping("/cancel-order/{id}")
    public String cancelOrder(@PathVariable Long id){
        return orderTotalService.cancelOrder(id);
    }
    /**
     * {@code GET  /order-totals/:id} : get the "id" orderTotal.
     *
     * @param id the id of the orderTotal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderTotal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-totals/{id}")
    public ResponseEntity<OrderTotalDto> getOrderTotal(@PathVariable Long id) {
        log.debug("REST request to get OrderTotal : {}", id);
        OrderTotalDto dto = orderTotalService.getById(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * {@code DELETE  /order-totals/:id} : delete the "id" orderTotal.
     *
     * @param id the id of the orderTotal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-totals/{id}")
    public ResponseEntity<?> deleteOrderTotal(@PathVariable Long id) {
        log.debug("REST request to deleteOrderTotal : {}", id);
        try {
            if (orderTotalService.deleteById(id)) {
                return ResponseEntity.noContent().build();
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when deleteOrderTotal", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/order-total/customer-confirm1/{id}")
    public ResponseEntity<?> customerRequest1(@PathVariable Long id){
        Boolean rs = orderTotalService1.customerConfirm1(id);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-total/customer-confirm3/{id}")
    public ResponseEntity<?> customerRequest2(@PathVariable Long id){
        Boolean rs = orderTotalService1.customerConfirm3(id);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-total/customer-confirm6/{id}")
    public ResponseEntity<?> customerRequest6(@PathVariable Long id){
        Boolean rs = orderTotalService1.customerConfirm6(id);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-total/staff-confirm2/{id}")
    public ResponseEntity<?> staffConfirm2(@PathVariable Long id,HttpServletRequest request){
        Boolean rs = orderTotalService1.staffConfirm2(id,request);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-total/staff-confirm4/{id}")
    public ResponseEntity<?> staffConfirm4(@PathVariable Long id,HttpServletRequest request){
        Boolean rs = orderTotalService1.staffConfirm4(id,request);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-total/staff-confirm5/{id}")
    public ResponseEntity<?> staffConfirm5(@PathVariable Long id,HttpServletRequest request){
        Boolean rs = orderTotalService1.staffConfirm5(id,request);
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-totalby")
    public ResponseEntity<?> waiting(@RequestParam("status") Integer status){
        List<OrderTotalDto> rs = orderTotalService1.getbystatus(status);
        return ResponseEntity.ok(rs);
    }
}
