package com.restarant.backend.web.controller;

import com.restarant.backend.dto.StaffDto;
import com.restarant.backend.entity.Account;
import com.restarant.backend.entity.Staff;
import com.restarant.backend.repository.AccountRepository;
import com.restarant.backend.repository.StaffRepository;
import com.restarant.backend.security.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class StaffResource {
    @Autowired
    private AccountRepository accountRepository;
    private final Logger log = LoggerFactory.getLogger(StaffResource.class);

    private static final String ENTITY_NAME = "staff";

    private final StaffRepository staffRepository;
    private JwtUtils jwtUtils;

    public StaffResource(StaffRepository staffRepository, JwtUtils jwtUtils) {
        this.staffRepository = staffRepository;
        this.jwtUtils = jwtUtils;
    }

    /**
     * {@code POST  /staff} : Create a new staff.
     *
     * @param staff the staff to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new staff, or with status {@code 400 (Bad Request)} if the staff has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/staff")
    public ResponseEntity<?> createStaff(@RequestBody StaffDto staff) throws URISyntaxException {
        log.debug("REST request to save Staff : {}", staff);
        BCryptPasswordEncoder bpe = new BCryptPasswordEncoder();
        Account accountExists = accountRepository.getByLogin(staff.getEmail());
        if (accountExists != null) {
            return ResponseEntity.badRequest().body("EMAIL_EXIST");
        }
        Account account = Account.builder()
                .login(staff.getEmail())
                .password(bpe.encode(staff.getPassword()))
                .role("ROLE_STAFF")
                .cecret("ROLE_STAFF")
                .timereset(LocalDate.now())
                .deleteFlag(false)
                .build();

        Account accountNew = accountRepository.save(account);

        Staff staffNew = Staff.builder()
                .name(staff.getName())
                .phoneNumber(staff.getPhoneNumber())
                .email(staff.getEmail())
                .gender(staff.getGender())
                .deleteflag(0L)
                .accountId(accountNew.getId())
                .build();
        staffRepository.save(staffNew);

//        Staff result = staffRepository.save(staff);
        return ResponseEntity.ok("SUCCESS");
    }

    /**
     * {@code PUT  /staff/:id} : Updates an existing staff.
     *
     * @param id    the id of the staff to save.
     * @param staff the staff to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated staff,
     * or with status {@code 400 (Bad Request)} if the staff is not valid,
     * or with status {@code 500 (Internal Server Error)} if the staff couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable(value = "id", required = false) final Long id, @RequestBody Staff staff)
            throws URISyntaxException {
        log.debug("REST request to update Staff : {}, {}", id, staff);

        if (!staffRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("entity not found");
        }

        Staff result = staffRepository.save(staff);
        return ResponseEntity.ok().body(result);
    }


    /**
     * {@code GET  /staff} : get all the staff.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of staff in body.
     */
    @GetMapping("/staff")
    public List<Staff> getAllStaff(HttpServletRequest request) {
        log.debug("REST request to get all Staff");
        return staffRepository.findAll();
    }

    /**
     * {@code GET  /staff/:id} : get the "id" staff.
     *
     * @param id the id of the staff to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the staff, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/staff/{id}")
    public ResponseEntity<Staff> getStaff(@PathVariable Long id) {
        log.debug("REST request to get Staff : {}", id);
        Optional<Staff> staff = staffRepository.findById(id);
        return ResponseEntity.of(staff);
    }

    /**
     * {@code DELETE  /staff/:id} : delete the "id" staff.
     *
     * @param id the id of the staff to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        log.debug("REST request to delete Staff : {}", id);
        staffRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
