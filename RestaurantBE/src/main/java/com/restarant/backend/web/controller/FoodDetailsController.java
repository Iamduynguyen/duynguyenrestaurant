package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.service.IFoodDetailService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;


@Slf4j
@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class FoodDetailsController {

    private final Logger log = LoggerFactory.getLogger(FoodDetailsController.class);

    private static final String ENTITY_NAME = "foodDetalls";
    private final IFoodDetailService foodDetailService;

    public FoodDetailsController(IFoodDetailService foodDetailService) {
        this.foodDetailService = foodDetailService;
    }

    /**
     * {@code POST  /food-detalls} : Create a new foodDetalls.
     *
     * @param foodDetalls the foodDetalls to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new foodDetalls, or with status {@code 400 (Bad Request)} if the foodDetalls has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/food-detalls")
    public ResponseEntity<?> createFoodDetalls(@RequestBody FoodDetailsDto dto) throws URISyntaxException {
        log.info("Someone create FoodDetail " + dto);
        try {
            FoodDetailsDto result = foodDetailService.create(dto);
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when create FoodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    /**
     * {@code PUT  /food-detalls/:id} : Updates an existing foodDetalls.
     *
     * @param id the id of the foodDetalls to save.
     * @param foodDetalls the foodDetalls to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodDetalls,
     * or with status {@code 400 (Bad Request)} if the foodDetalls is not valid,
     * or with status {@code 500 (Internal Server Error)} if the foodDetalls couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/food-detalls/{id}")
    public ResponseEntity<?> updateFoodDetalls(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodDetailsDto dto
    ) throws URISyntaxException {
        log.debug("REST request to update FoodDetalls : {}, {}", id, dto);
        try {
            FoodDetailsDto result = foodDetailService.update(id, dto);
            if(result == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            return ResponseEntity.ok(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update FoodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    /**
     * {@code GET  /food-detalls} : get all the foodDetalls.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foodDetalls in body.
     */
    @GetMapping("/food-detalls")
    public List<FoodDetailsDto> getAllFoodDetalls() {
        log.debug("REST request to get all FoodDetalls");
        return (List<FoodDetailsDto>) foodDetailService.getAll();
    }

    /**
     * {@code GET  /food-detalls/:id} : get the "id" foodDetalls.
     *
     * @param id the id of the foodDetalls to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the foodDetalls, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/food-detalls/{id}")
    public ResponseEntity<FoodDetailsDto> getFoodDetalls(@PathVariable Long id) {
        log.debug("REST request to get FoodDetalls : {}", id);
        FoodDetailsDto foodDetalls = foodDetailService.getById(id);
        if(foodDetalls == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(foodDetalls);
    }

    /**
     * {@code DELETE  /food-detalls/:id} : delete the "id" foodDetalls.
     *
     * @param id the id of the foodDetalls to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/food-detalls/{id}")
    public ResponseEntity<?> deleteFoodDetalls(@PathVariable Long id) {
        log.debug("REST request to delete FoodDetalls : {}", id);
        try {
            if(foodDetailService.deleteById(id)){
                return ResponseEntity.noContent().build();
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when delete foodDetail", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
}
