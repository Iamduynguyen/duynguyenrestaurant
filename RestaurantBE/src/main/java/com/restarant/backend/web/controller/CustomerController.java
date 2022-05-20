package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FavouriteFoodDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.service.ICustomerService;
import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.service.utils.JwtServiceUtils;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;


@Slf4j
@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class CustomerController {

    @Autowired
    private JwtServiceUtils jwtServiceUtils;

    private static final String ENTITY_NAME = "customer";


    private final ICustomerService customerService;

    public CustomerController(ICustomerService customerService) {
        this.customerService = customerService;
    }

    /**
     * {@code POST  /customers} : Create a new customer.
     *
     * @param customer the customer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customer, or with status {@code 400 (Bad Request)} if the customer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/customers")
    public ResponseEntity<?> createCustomer(@RequestBody CustomerDto customerDto) throws URISyntaxException {
        log.debug("REST request to save Customer : {}", customerDto);

        try {
            CustomerDto result = customerService.create(customerDto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when save customer", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/customers/favourite-food")
    public ResponseEntity<?> addFavouriteFood(@RequestBody FavouriteFoodDto dto,
                                              HttpServletRequest request) throws URISyntaxException {
        log.debug("REST request to save Customer : {}", dto);

        try {
            CustomerDto result = customerService.addFavouriteFood(request, dto);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when add favourite food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/customers/favourite-food")
    public ResponseEntity<?> getFavouriteFood(HttpServletRequest request) throws URISyntaxException {
        try {
            CustomerDto result = customerService.getById(request);
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when add favourite food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/customers/favourite-food")
    public ResponseEntity<?> deleteFavouriteFood(HttpServletRequest request, @RequestBody FavouriteFoodDto dto) throws URISyntaxException {
        try {
            log.info("someone delete favourite food");
            if(customerService.delete(request, dto.getFoodDetailId())){
                return ResponseEntity.status(HttpStatus.OK).body(null);
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when add favourite food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    /**
     * {@code PUT  /customers/:id} : Updates an existing customer.
     *
     * @param id the id of the customer to save.
     * @param customer the customer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customer,
     * or with status {@code 400 (Bad Request)} if the customer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
//    @PutMapping("/customers/{id}")
//    public ResponseEntity<?> updateCustomer(
//        @PathVariable(value = "id", required = false) final Long id, @RequestBody Customer customer) throws URISyntaxException {
//        log.debug("REST request to update Customer : {}, {}", id, customer);
//        if (!customerService.isExistById(id)) {
//            return ResponseEntity.badRequest().body("entity not exit");
//        }
//        Customer result = customerService.save(customer);
//        return ResponseEntity.ok().body(result);
//    }


    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        log.debug("REST request to get all Customers");
        return customerService.getAllCustomer();
    }

    /**
     * {@code GET  /customers/:id} : get the "id" customer.
     *
     * @param request the id of the customer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/customer")
    public ResponseEntity<?> getCustomer(HttpServletRequest request) {
        try {
            CustomerDto customer = customerService.getById(request);
            if(customer == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok(customer);
        } catch (InvalidDataExeception e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PostMapping("/customer")
    public ResponseEntity<?> saveCustomer(HttpServletRequest request, @RequestBody CustomerDto customerDto) {
        try {
            CustomerDto customer = customerService.getById(request);
            System.out.println(customerDto.toString());
            if(customer == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            } else {
                customer.setName(customerDto.getName());
                customer.setPhoneNumber(customerDto.getPhoneNumber());
                customerService.create(customerDto);
            }
            return ResponseEntity.ok(customer);
        } catch (InvalidDataExeception e) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    /**
     * {@code DELETE  /customers/:id} : delete the "id" customer.
     *
     * @param id the id of the customer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/customer/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        log.debug("REST request to delete Customer : {}", id);
        try {
            customerService.deleteById(id);
            return ResponseEntity.ok(null);
        } catch (InvalidDataExeception e) {
            log.error("Error when delete customer", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
