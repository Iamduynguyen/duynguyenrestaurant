package com.restarant.backend.repository;

import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data SQL repository for the Food entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query("select f from Food f where f.name = :query or f.category.name = :query or f.title = :query")
    Page<Food> getByQuery(Pageable pageable,@Param("query") String query);

    @Query("select f from Food f where f.category.id = :query")
    Page<Food> getByCategoryId(Pageable pageable,@Param("query") Long query);
}
