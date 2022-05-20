package com.restarant.backend.repository;


import com.restarant.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT e FROM Customer e WHERE e.account.login = :username")
    Customer getCustomerByUsername(String username);

    List<Customer> findAllByDeleteflag(Long deleteflag);
}
