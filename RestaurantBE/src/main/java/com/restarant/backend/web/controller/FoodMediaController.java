package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.dto.FoodMediaDto;
import com.restarant.backend.repository.FoodMediaRepository;
import com.restarant.backend.service.IFoodMediaService;
import com.restarant.backend.service.impl.FoodMediaService;
import com.restarant.backend.service.utils.UploadService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class FoodMediaController {

    private final IFoodMediaService foodMediaService;

    public FoodMediaController(IFoodMediaService foodMediaService) {
        this.foodMediaService = foodMediaService;
    }

    @PostMapping("/food-medias")
    public ResponseEntity<?> saveFoodMedia(@RequestBody FoodMediaDto dto) {
        log.info("REST request to save foodMedia : {}", dto);
        try {
            FoodMediaDto result = foodMediaService.create(dto);
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when create Food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

//    @PostMapping("/uploads")
//    public List<String> uploads(@RequestBody MultipartFile[] files){
//        List<String> urls = new ArrayList<>();
//        for (MultipartFile file:files){
//            urls.add(newsService.uploadFile(file));
//        }
//        return urls;
//    }

    @PostMapping("/food-medias/image/upload")
    public ResponseEntity<?> upload(@RequestBody MultipartFile[] files) {
        List<String> links = new ArrayList<>();

        for(MultipartFile multipartFile: files){
            try {
                links.add(UploadService.upload(multipartFile));
            } catch (IOException e) {
            }
        }
        return ResponseEntity.ok(links);
    }

    @PutMapping("/food-medias")
    public ResponseEntity<?> updateFoodMedia(@PathVariable(value = "id", required = false) final Long id, @RequestBody FoodMediaDto dto)
            throws URISyntaxException {
        log.debug("REST request to update Food : {}, {}", id, dto);
        try {
            FoodMediaDto result = foodMediaService.update(id, dto);
            if (result == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("food Id not exists!");
            }
            return ResponseEntity.ok().body(result);
        } catch (InvalidDataExeception e) {
            log.error("Error when update Food", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/food-medias/{id}")
    public ResponseEntity<?> getByFoodId(@PathVariable Long id) {
        return ResponseEntity.ok(foodMediaService.getById(id));
    }

    @DeleteMapping("/food-medias/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            foodMediaService.deleteById(id);
            return ResponseEntity.ok("Delete success");
        } catch (InvalidDataExeception e) {
            log.error("Error when delete foodMedia", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
