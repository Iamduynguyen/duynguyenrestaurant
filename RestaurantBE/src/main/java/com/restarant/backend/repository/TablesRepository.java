package com.restarant.backend.repository;

import com.restarant.backend.entity.Tables;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

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
}
