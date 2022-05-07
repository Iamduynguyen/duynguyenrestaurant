package com.restarant.backend.repository;

import com.restarant.backend.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FeedbackRepository extends JpaRepository<Feedback,Long> {

    @Query("select f from Feedback f where f.id = :query or f.content = :query or f.customer = :query")
    Page<Feedback> getByQuery(Pageable pageable, @Param("query") String query);

    @Query("select f from Feedback f where f.customer.id = :query")
    Page<Feedback> getById(Pageable pageable,@Param("query") Long query);
}
