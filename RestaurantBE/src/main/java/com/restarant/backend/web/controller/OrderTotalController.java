package com.restarant.backend.web.controller;

import com.restarant.backend.dto.*;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.OrderTotal;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.repository.OrderTotalRepository;
import com.restarant.backend.service.IOrderTotalService;
import com.restarant.backend.service.impl.OrderTotalService;
import com.restarant.backend.service.utils.ConvertTime;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api")
//@Transactional
@CrossOrigin("*")
public class OrderTotalController {

    @Autowired
    private OrderTotalRepository orderTotalRepository;

    @Autowired
    FoodDetallsRepository foodDetallsRepository;

    @Autowired
    OrderTotalService orderTotalService1;
    @Autowired
    ConvertTime convertTime;

    private final Logger log = LoggerFactory.getLogger(OrderTotalController.class);

    private static final String ENTITY_NAME = "orderTotal";

    private final IOrderTotalService orderTotalService;

    public OrderTotalController(IOrderTotalService orderTotalService) {
        this.orderTotalService = orderTotalService;
    }
//    /**
//     * {@code POST  /order-totals} : Create a new orderTotal.
//     *
//     * @param orderTotal the orderTotal to create.
//     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderTotal, or with status {@code 400 (Bad Request)} if the orderTotal has already an ID.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PostMapping("/order-totals")
//    public ResponseEntity<OrderTotal> createOrderTotal(@RequestBody OrderTotal orderTotal) throws URISyntaxException {
//        log.debug("REST request to save OrderTotal : {}", orderTotal);
//        OrderTotal result = orderTotalRepository.save(orderTotal);
//        return ResponseEntity.ok().body(result);
//    }

//    /**
//     * {@code PUT  /order-totals/:id} : Updates an existing orderTotal.
//     *
//     * @param id the id of the orderTotal to save.
//     * @param orderTotal the orderTotal to update.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderTotal,
//     * or with status {@code 400 (Bad Request)} if the orderTotal is not valid,
//     * or with status {@code 500 (Internal Server Error)} if the orderTotal couldn't be updated.
//     * @throws URISyntaxException if the Location URI syntax is incorrect.
//     */
//    @PutMapping("/order-totals/{id}")
//    public ResponseEntity<?> updateOrderTotal(
//        @PathVariable(value = "id", required = false) final Long id,
//        @RequestBody OrderTotal orderTotal
//    ) throws URISyntaxException {
//        log.debug("REST request to update OrderTotal : {}, {}", id, orderTotal);
//        if (!orderTotalRepository.existsById(id)) {
//            return ResponseEntity.badRequest().body("Entity not found");
//        }
//        OrderTotal result = orderTotalRepository.save(orderTotal);
//        return ResponseEntity.ok().body(result);
//    }


    //    /**
//     * {@code GET  /order-totals} : get all the orderTotals.
//     *
//     * @param filter the filter of the request.
//     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderTotals in body.
//     */
//    @GetMapping("/order-totals")
//    public List<OrderTotal> getAllOrderTotals(@RequestParam(required = false) String filter) {
//        if ("payment-is-null".equals(filter)) {
//            log.debug("REST request to get all OrderTotals where payment is null");
//            return StreamSupport
//                .stream(orderTotalRepository.findAll().spliterator(), false)
//                .filter(orderTotal -> orderTotal.getPayment() == null)
//                .collect(Collectors.toList());
//        }
//        log.debug("REST request to get all OrderTotals");
//        return orderTotalRepository.findAll();
//    }
    @PutMapping("payment-vnpay/{id}")
    public String paymentVnpay(HttpServletRequest request,@PathVariable Long id) throws IOException {
        return orderTotalService.paymentVnpay(request, id);
    }
    @GetMapping("check-out-vnpay")
    public RedirectView checkOutVnpay(@RequestParam String vnp_TxnRef, @RequestParam String vnp_ResponseCode){
        RedirectView view = new RedirectView();
        String response = orderTotalService.checkOutVnpay(vnp_ResponseCode,vnp_TxnRef);
//        view.addStaticAttribute("status",response);
        view.setUrl("http://viprestaurant.cf/cart/"+response);
        return view;
    }

    @GetMapping("/orders")
    public List<GetAllToTalOrder> getAllToTalOrders(){
        return orderTotalService.getAllOrderTotal();
    }

    @GetMapping("/order-total/customer-confirm1/{id}")
    public ResponseEntity<?> customerRequest1(@PathVariable Long id){
        Boolean rs = orderTotalService1.customerConfirm1(id);
        return ResponseEntity.ok(rs);
    }

    @PutMapping("/confirm-customer-order-online/{id}")
    public String confirmCustomerOrderOnline(@PathVariable Long id){
        return orderTotalService.confirmCustomerOrderOnline(id);
    }
    @PostMapping("/create-order-couter")
    public String createCounter(@RequestBody OrderCouterDto request, HttpServletRequest httpServletRequest) {
        return orderTotalService.registrationOrderCounter(request, httpServletRequest);
    }
    @PutMapping("/confirm-customer-go-restaurant/{id}")
    public String confirmCustomerGoRestaurant(@PathVariable Long id) throws InvalidDataExeception {
      return orderTotalService.confirmCustomerGoRestaurant(id);
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
    public String confirmDepositOnline(@RequestBody ConfirmDepositOnline request,HttpServletRequest req){
        return orderTotalService.confirmDepositOnline(request,req);
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

    @GetMapping("/order-totals-status/{id}")
    public ResponseEntity<?> getStatus(@PathVariable Long id) {
        Map<String,Object> map = new HashMap<>();
        OrderTotal rs = orderTotalRepository.findById(id).get();
        Integer status = rs.getStatus();
        BigDecimal deposit = rs.getDeposit();
        map.put("status",status);
        map.put("deposit",deposit);
        LocalDateTime x = convertTime.convertToLocalDateTime(rs.getOrderTime());
        LocalDateTime y = convertTime.convertToLocalDateTime(rs.getEndTime());
        String date = x.getDayOfMonth()+"/"+ x.getMonth().getValue()+"/"+x.getYear();
        String gioan = x.getHour()+":"+x.getMinute();
        String gionghi = y.getHour()+":"+y.getMinute();
        map.put("start", convertTime.convertLocalDateTimeToDateUsingInstant(x));
        map.put("end",convertTime.convertLocalDateTimeToDateUsingInstant(y));
        map.put("gioan",gioan);
        map.put("gionghi",gionghi);
        map.put("ngay",date);
        map.put("date",x.getDayOfMonth()+"/"+ x.getMonth()+"/"+x.getYear());
        map.put("tiencoc",rs.getDeposit());
        map.put("tongtienhoadon",rs.getAmountTotal());
        return ResponseEntity.ok(map);
    }

    @GetMapping("/order-totals-thanhtoan/{id}")
    public ResponseEntity<?> getThanhtoan(@PathVariable Long id) {
        List<OrderDetails> orderDetails = orderTotalRepository.getTinhtong(id);
        List<ThanhtoanDto> rs = new ArrayList<>();
        for (OrderDetails x:orderDetails){
            ThanhtoanDto dto = new ThanhtoanDto();
            dto.setId(x.getId());
            if (x.getAmount()==null){
                dto.setAmountTotal(new BigDecimal("0"));
            }else {
                dto.setAmountTotal(x.getAmount());
            }
            dto.setSl(x.getQuantity());
            if (x.getFoodDetalls().getFood().getName().length()>15){
                dto.setFoodName(x.getFoodDetalls().getFood().getName().substring(0,15)+"...");
            }else {
                dto.setFoodName(x.getFoodDetalls().getFood().getName());
            }
            dto.setFoodSize(x.getFoodDetalls().getFoodsize());
            BigDecimal tong ;
            try {
                tong=dto.getAmountTotal().multiply(new BigDecimal(dto.getSl()));
            }catch (Exception e){
                tong = new BigDecimal("0");
            }
            dto.setTongtien(tong);
            rs.add(dto);
        }
        return ResponseEntity.ok(rs);
    }

    @GetMapping("/order-totals-khachden/{id}")
    public ResponseEntity<?> xacnhanKhachden(@PathVariable Long id) {
        try {
            OrderTotal orderTotal = orderTotalRepository.findById(id).get();
            orderTotal.setStatus(5);
            orderTotalRepository.save(orderTotal);
            return ResponseEntity.ok("SUCCESS");
        }catch (Exception e){
            return ResponseEntity.ok("Fail");
        }
    }

}
