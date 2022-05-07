package com.restarant.backend.repository;


import com.restarant.backend.entity.FoodDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the FoodDetalls entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodDetallsRepository extends JpaRepository<FoodDetails, Long> {
    @Query(value = "select f from FoodDetails f where f.food.id = :id")
    List<FoodDetails> getByFoodId(@Param("id") Long id);
//    FoodDetails findByIdAnd(Long id);

}
