package com.restarant.backend.service;

import com.restarant.backend.dto.FoodDto;
import com.restarant.backend.model.Pages;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IFoodService extends IServiceAdapter<FoodDto> {

    List<FoodDto> getAll(Pageable pageable);
    Pages getPage(Pageable pageable);
    List<FoodDto> getbyQuery(Pageable pageable, String query);
    List<FoodDto> getByCategoryId(Pageable pageable,Long id);
    List<FoodDto> getFoodsByCategoryId(Long id);

}
