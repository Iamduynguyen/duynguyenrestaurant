package com.restarant.backend.repository;

import com.restarant.backend.entity.Category;
import com.restarant.backend.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data SQL repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
//    @Query("SELECT e FROM Category e WHERE e.deleteflag <> 1")
//    Page<Category> findAll(Pageable pageable);
//
//    @Query("SELECT e FROM Category e WHERE e.id = :id AND e.deleteflag <> 1")
//    Optional<Category> findById(Long id);
//
//    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN TRUE ELSE FALSE END " +
//            "FROM Category e " +
//            "WHERE e.id = :id " +
//            "AND e.deleteflag <> 1")
//    boolean existsById(Long id);
}
