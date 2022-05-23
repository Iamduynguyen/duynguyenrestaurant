package com.restarant.backend.web.controller;


import com.restarant.backend.dto.ChangePasswordDto;
import com.restarant.backend.entity.Account;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.repository.AccountRepository;
import com.restarant.backend.security.jwt.JwtUtils;
import com.restarant.backend.security.services.UserDetailsImpl;
import com.restarant.backend.service.IAccountService;
import com.restarant.backend.dto.LoginRequest;
import com.restarant.backend.service.utils.JwtServiceUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.net.URISyntaxException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for managing the current user's account.
 */
@Slf4j
@RestController
@RequestMapping("/service")
@CrossOrigin("*")
public class AccountController {

    private final IAccountService accountService;
    private final AccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final JwtServiceUtils jwtServiceUtils;
    private final PasswordEncoder encoder;

    @Autowired
    private HttpServletRequest request;

    public AccountController(IAccountService accountService,
                             AccountRepository accountRepository, AuthenticationManager authenticationManager,
                             JwtUtils jwtUtils,
                             JwtServiceUtils jwtServiceUtils, PasswordEncoder encoder) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.jwtServiceUtils = jwtServiceUtils;
        this.encoder = encoder;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        Map<String, String> map = new HashMap();
        map.put("username",userDetails.getUsername());
        map.put("role",roles.get(0));
        map.put("token",jwt);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createAccount(@RequestBody Account account,@RequestParam("phone") String phone) throws URISyntaxException {
        account.setPassword(encoder.encode(account.getPassword()));
        account.setTimereset(LocalDate.now());
        account.setCecret(UUID.randomUUID().toString());
        account.setRole("ROLE_USER");
        account.setDeleteFlag(false);
        Account result = accountService.createAccount(account, phone);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/account")
    public ResponseEntity<?> getAccount(Principal principal){
        Account result = accountService.getAccountByLogin(principal.getName());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/change-password")
    public String changePassword(HttpServletRequest request, @RequestBody ChangePasswordDto changePasswordDto){
        Customer customer = jwtServiceUtils.getCustomerByToken(request);
        Account account = customer.getAccount();
        System.out.println(changePasswordDto);
        BCryptPasswordEncoder encode = new BCryptPasswordEncoder();
        if(!encode.matches(changePasswordDto.getPasswordOld(), account.getPassword())){
            return "PASS_FAIL";
        } else if(!changePasswordDto.getPasswordNew().equals(changePasswordDto.getPasswordConfirm())){
            return "PASS_NOT_EQUAL";
        } else {
            account.setPassword(encode.encode(changePasswordDto.getPasswordNew()));
            accountRepository.save(account);
            return "SUCCESS";
        }
    }
}
