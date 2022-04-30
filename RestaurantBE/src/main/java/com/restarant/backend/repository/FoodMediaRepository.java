package com.restarant.backend.repository;

import com.restarant.backend.entity.FoodMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

/**
 * Spring Data SQL repository for the FoodMedia entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodMediaRepository extends JpaRepository<FoodMedia, Long> {
    @Query(value = "select m from FoodMedia  m where m.foodDetalls.id =:id")
    Set<FoodMedia> getByfoodId(@Param("id") Long id);
}
