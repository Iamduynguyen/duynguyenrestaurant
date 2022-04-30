package com.restarant.backend.repository;

import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.TableOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

/**
 * Spring Data SQL repository for the OrderDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
    @Query("select o from OrderDetails o where o.tableOrder = :key")
    Collection<OrderDetails> getByTableorde(@Param("key")TableOrder tableOrder);
}
