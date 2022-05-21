package com.restarant.backend.repository;

import com.restarant.backend.entity.TableOrder;
import com.restarant.backend.entity.Tables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Spring Data SQL repository for the Tables entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TablesRepository extends JpaRepository<Tables, Long> {
   // @Query("SELECT tbl FROM Tables tbl WHERE tbl.id = :id AND tbl.status = :status")
    Tables findByIdAndStatusIs(Long id, Long status);

    @Query("SELECT tbl FROM Tables tbl WHERE tbl.deleteflag = 0")
    Collection<Tables> findByDeleteflagFalse();

//    @Query(value = "select t from TableOrder t where (t.orderTotal.orderTime <:start and t.orderTotal.orderTime<:start) or (t.orderTotal.orderTime >:start and t.orderTotal.orderTime>:start)")
//    List<TableOrder> getTablesOrderID(@Param("start") Long start,@Param("end") Long end);
//
//    @Query(value = "select t from Tables t where t.tableOrders in :tb ")
//    List<Tables> getTablesByTableOrders(@Param("tb")List<TableOrder> lst);
}
