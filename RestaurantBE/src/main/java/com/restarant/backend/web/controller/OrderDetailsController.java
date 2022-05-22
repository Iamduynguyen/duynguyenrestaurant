package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.dto.OrderDetailsDto;
import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.repository.OrderDetailsRepository;
import com.restarant.backend.service.IOrderDetailsService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class OrderDetailsController {

    private final Logger log = LoggerFactory.getLogger(OrderDetailsController.class);

    private static final String ENTITY_NAME = "orderDetails";

    private final IOrderDetailsService orderDetailsService;

    public OrderDetailsController(IOrderDetailsService orderDetailsService) {
        this.orderDetailsService = orderDetailsService;
    }

    /**
     * {@code POST  /order-details} : Create a new orderDetails.
     *
     * @param orderDetails the orderDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderDetails, or with status {@code 400 (Bad Request)} if the orderDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/order-details")
    public ResponseEntity<?> createOrderDetails(@RequestBody List<OrderDetailsDto> dto) throws URISyntaxException {
        log.debug("REST request to save OrderDetails : {}", dto);

        List<OrderDetailsDto> result = new ArrayList<>();
        for (OrderDetailsDto orderDetailsDto : dto) {
            try {
                System.out.println(orderDetailsDto.toString());
                result.add(orderDetailsService.create(orderDetailsDto));
            } catch (InvalidDataExeception e) {
                log.error("Error when create order-detail", e);
            }
        }
        return ResponseEntity.ok().body(result);

    }

    /**
     * {@code PUT  /order-details/:id} : Updates an existing orderDetails.
     *
     * @param id           the id of the orderDetails to save.
     * @param orderDetails the orderDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderDetails,
     * or with status {@code 400 (Bad Request)} if the orderDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/order-details/{id}")
    public ResponseEntity<?> updateOrderDetails(
            @PathVariable(value = "id", required = false) final Long id,
            @RequestBody OrderDetailsDto dto
    ) throws URISyntaxException {
        log.debug("REST request to update OrderDetails : {}, {}", id, dto);
        try {
            OrderDetailsDto result = orderDetailsService.update(id, dto);
            if (result == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update FoodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/confirm_orderdetail/{id}")
    public ResponseEntity<?> confirmOrderDetails(
            @PathVariable(value = "id", required = false) final Long id,
            @RequestBody OrderDetailsDto dto
    ) throws URISyntaxException {
        log.debug("REST request to update OrderDetails : {}, {}", id, dto);
        try {
            OrderDetailsDto result = orderDetailsService.update(id, dto);
            if (result == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update FoodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    /**
     * {@code GET  /order-details} : get all the orderDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderDetails in body.
     */
    @GetMapping("/order-details")
    public List<OrderDetailsDto> getAllOrderDetails(Pageable pageable) {
        log.debug("REST request to get all OrderDetails");
        return (List<OrderDetailsDto>) orderDetailsService.getAll(pageable);
    }

    /**
     * {@code GET  /order-details/:id} : get the "id" orderDetails.
     *
     * @param id the id of the orderDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/order-details/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        log.debug("REST request to get OrderDetails : {}", id);
        OrderDetailsDto result = orderDetailsService.getById(id);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * {@code DELETE  /order-details/:id} : delete the "id" orderDetails.
     *
     * @param id the id of the orderDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/order-details/{id}")
    public ResponseEntity<?> deleteOrderDetails(@PathVariable Long id) {
        log.debug("REST request to delete OrderDetails : {}", id);
        try {
            if (orderDetailsService.deleteById(id)) {
                return ResponseEntity.noContent().build();
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when delete foodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

}
