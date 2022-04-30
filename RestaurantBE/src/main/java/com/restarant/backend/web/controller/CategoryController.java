package com.restarant.backend.web.controller;

import com.restarant.backend.dto.CategoryDto;
import com.restarant.backend.entity.Category;
import com.restarant.backend.model.Pages;
import com.restarant.backend.repository.CategoryRepository;
import com.restarant.backend.service.ICategoryService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class CategoryController {

    private final Logger log = LoggerFactory.getLogger(CategoryController.class);

    private static final String ENTITY_NAME = "category";

    private final ICategoryService categoryService;

    public CategoryController(ICategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) throws InvalidDataExeception {
        log.debug("REST request to save Category : {}", categoryDto);
        CategoryDto result = categoryService.create(categoryDto);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CategoryDto categoryDto
    )  throws InvalidDataExeception {
        log.debug("REST request to update Category : {}, {}", id, categoryDto);
        CategoryDto result = categoryService.update(id, categoryDto);
        if(result == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/categories")
    public List<CategoryDto> getAllCategories(Pageable pageable) {
        log.debug("REST request to get all Categories");
        return (List<CategoryDto>) categoryService.getAll(pageable);
    }


    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long id) {

        log.debug("REST request to get Category : {}", id);
        CategoryDto category = categoryService.getById(id);
        if(category == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        log.debug("REST request to delete Category : {}", id);
        try {
            if(categoryService.deleteById(id)){
                return ResponseEntity.ok().body(null);
            }
        } catch (InvalidDataExeception e) {
            log.error("Error when ddelete category", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/categories/pages")
    public ResponseEntity<Pages> getPages(Pageable pageable){
        return ResponseEntity.ok(categoryService.getPage(pageable));
    }
}
