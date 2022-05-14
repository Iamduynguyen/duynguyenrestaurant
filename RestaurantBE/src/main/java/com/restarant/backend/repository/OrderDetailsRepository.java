package com.restarant.backend.repository;

import com.restarant.backend.entity.OrderDetails;
import com.restarant.backend.entity.TableOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

/**
 * Spring Data SQL repository for the OrderDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
    @Query("select o from OrderDetails o where o.tableOrder = :key")
    Collection<OrderDetails> getByTableorde(@Param("key")TableOrder tableOrder);

    @Query("select o from OrderDetails o where o.tableOrder.orderTotal.id= :id")
    List<OrderDetails> getByOrdertotalId(@Param("id")Long id);

    @Query("select o from OrderDetails o where o.tableOrder.id= :id")
    List<OrderDetails> getByOrderTableId(@Param("id")Long id);

    OrderDetails findByTableOrderIdAndFoodDetallsId(Long orderTableId, Long foodDetailsId);

    @Transactional
    @Modifying
    @Query("UPDATE OrderDetails o SET o.deleteflag = 1 where o.id = :id")
    void deleteOrderDetailsByIds(@Param("id") Long id);
}
