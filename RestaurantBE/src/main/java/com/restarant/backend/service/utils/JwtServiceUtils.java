package com.restarant.backend.service.utils;

import com.restarant.backend.entity.Account;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.repository.CustomerRepository;
import com.restarant.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class JwtServiceUtils {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomerRepository customerRepository;

    public Account getAccountByToken(HttpServletRequest request) {
//        String token = request.getHeader("token");
//        if(!jwtUtils.validateJwtToken(token)){
//            return null;
//        }
//        String username = jwtUtils.getUserNameFromJwtToken(token);
        return null;
    }

    public Customer getCustomerByToken(HttpServletRequest request){
        String token = request.getHeader("token");
        if(token != null && jwtUtils.validateJwtToken(token)){
            String username = jwtUtils.getUserNameFromJwtToken(token);
            System.out.println(username);
            Customer customer = customerRepository.getCustomerByUsername(username);
            return customer;
        }
        return null;
    }
}
