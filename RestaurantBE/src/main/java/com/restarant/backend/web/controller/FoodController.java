package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.entity.Food;
import com.restarant.backend.model.Pages;
import com.restarant.backend.service.IFoodService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.SneakyThrows;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class FoodController {

    private final Logger log = LoggerFactory.getLogger(FoodController.class);

    private static final String ENTITY_NAME = "food";

    private final IFoodService foodservice;

    public FoodController(@Qualifier("foodService") IFoodService foodservice) {
        this.foodservice = foodservice;
    }

    /**
     * {@code POST  /foods} : Create a new food.
     *
     * @param foodDto the food to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new food, or with status {@code 400 (Bad Request)} if the food has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/foods")
    public ResponseEntity<?> createFood(@RequestBody FoodDto foodDto) throws URISyntaxException {
        log.info("REST request to save Food : {}", foodDto);
        try {
            FoodDto result = foodservice.create(foodDto);
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when create Food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * {@code PUT  /foods/:id} : Updates an existing food.
     *
     * @param id the id of the food to save.
     * @param foodDto the food to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated food,
     * or with status {@code 400 (Bad Request)} if the food is not valid,
     * or with status {@code 500 (Internal Server Error)} if the food couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/foods/{id}")
    public ResponseEntity<?> updateFood(@PathVariable(value = "id", required = false) final Long id, @RequestBody FoodDto foodDto)
        throws URISyntaxException {
        log.debug("REST request to update Food : {}, {}", id, foodDto);
        try {
            FoodDto result = foodservice.update(id, foodDto);
            if(result == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("food Id not exists!");
            }
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update Food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    /**
     * {@code GET  /foods} : get all the foods.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foods in body.
     */
    @GetMapping("/foods")
    public ResponseEntity<?> getAllFoods(Pageable pageable) {
        log.debug("REST request to get all Foods");
        List<FoodDto> result = foodservice.getAll(pageable);
        for (FoodDto x:result){
            if (!x.getFoodDetails().isEmpty()){
                if(!x.getFoodDetails().get(0).getFoodMedias().isEmpty()) {
                    x.setAvtUrl(x.getFoodDetails().get(0).getFoodMedias().get(0).getFoodUrl());
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/foodsby")
    public ResponseEntity<?> getAllFoods(@RequestParam String query,Pageable pageable) {
        log.info("query\t"+query);
        List<FoodDto> lst = new ArrayList<>();
        try {
            Long categoryId = Long.parseLong(query);
            lst = foodservice.getByCategoryId(pageable,categoryId);
        } catch (Exception e){
            lst = foodservice.getbyQuery(pageable,query);
        }
        return ResponseEntity.ok(lst);
    }

    /**
     * {@code GET  /foods/:id} : get the "id" food.
     *
     * @param id the id of the food to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the food, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/foods/{id}")
    public ResponseEntity<FoodDto> getFood(@PathVariable Long id) {
        log.debug("REST request to get Food : {}", id);
        FoodDto foodDto = foodservice.getById(id);
        if(foodDto == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(foodDto);
    }

    /**
     * {@code DELETE  /foods/:id} : delete the "id" food.
     *
     * @param id the id of the food to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/foods/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        log.debug("REST request to delete Food : {}", id);
        try {
            if(foodservice.deleteById(id)){
                return ResponseEntity.ok().body("Delete success!");
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when delete food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/foods/pages")
    public ResponseEntity<Pages> getPages(Pageable pageable){
        return ResponseEntity.ok(foodservice.getPage(pageable));
    }

    @GetMapping("/foods/filterByCategory/{id}")
    public ResponseEntity<List<FoodDto>> getAllFoods(@PathVariable Long id) {
        List<FoodDto> result = foodservice.getFoodsByCategoryId(id);
        for (FoodDto x:result) {
            if (!x.getFoodDetails().isEmpty()){
                x.setAvtUrl(x.getFoodDetails().get(0).getFoodMedias().get(0).getFoodUrl());
            }
        }
        return ResponseEntity.ok(result);
    }
}
