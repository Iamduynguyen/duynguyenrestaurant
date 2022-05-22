package com.restarant.backend.repository;

import com.restarant.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account,Long> {
    @Query(value = "select a from Account a where a.login =:login and a.deleteFlag = false ")
    Account getByLogin(@Param("login") String login);
}
