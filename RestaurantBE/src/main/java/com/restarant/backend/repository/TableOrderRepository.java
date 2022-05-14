package com.restarant.backend.repository;

import com.restarant.backend.entity.TableOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Spring Data SQL repository for the TableOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TableOrderRepository extends JpaRepository<TableOrder, Long> {
    @Query("SELECT e FROM TableOrder e WHERE e.tables.id = :tableId")
    List<TableOrder> getAllByTableId(Long tableId);
    @Query("SELECT e FROM TableOrder e WHERE e.orderTotal.id = :tableId")
    List<TableOrder> getAllByTotalId(Long tableId);

    TableOrder findByOrderTotalId(Long orderId);

    @Query("SELECT e FROM TableOrder e WHERE e.tables.id = :tableId")
    Collection<TableOrder> getAllByTable(Long tableId);

    @Query("SELECT e FROM TableOrder e ")
    TableOrder getByOrderTimeAndTableId(long tableId, long startTime, long endTime);

    @Query("select t from TableOrder t where t.orderTotal.orderTime > :start and t.orderTotal.orderTime < :end")
    List<TableOrder> getBystart(@Param("start") Long start, @Param("end") Long end);

    @Query("select t from TableOrder t where t.orderTotal.endTime > :start and t.orderTotal.orderTime < :end")
    List<TableOrder> getByEnd(@Param("start") Long start, @Param("end") Long end);
}
