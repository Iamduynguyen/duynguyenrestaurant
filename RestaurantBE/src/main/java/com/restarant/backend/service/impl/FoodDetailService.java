package com.restarant.backend.service.impl;

import com.restarant.backend.dto.FoodDetailsDto;
import com.restarant.backend.dto.FoodMediaDto;
import com.restarant.backend.entity.Food;
import com.restarant.backend.entity.FoodDetails;
import com.restarant.backend.entity.FoodMedia;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.repository.FoodRepository;
import com.restarant.backend.service.IFoodDetailService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.FoodDetailValidator;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FoodDetailService implements IFoodDetailService {

    private final FoodDetallsRepository foodDetallsRepository;
    private final FoodRepository foodRepository;
    private final IConverterDto<FoodDetails, FoodDetailsDto> foodDetailMapper;
    private final IConverterDto<FoodMedia, FoodMediaDto> foodMedialMapper;
    private final FoodDetailValidator foodDetailValidator = new FoodDetailValidator();

    public FoodDetailService(FoodDetallsRepository foodDetallsRepository,
                             @Qualifier("foodDetailsMapper") IConverterDto<FoodDetails, FoodDetailsDto> foodDetailMapper,
                             @Qualifier("foodMediaMapper") IConverterDto<FoodMedia, FoodMediaDto> foodMedialMapper,
                             FoodRepository foodRepository) {
        this.foodDetallsRepository = foodDetallsRepository;
        this.foodDetailMapper = foodDetailMapper;
        this.foodMedialMapper = foodMedialMapper;
        this.foodRepository = foodRepository;
    }

    @Override
    public FoodDetailsDto create(FoodDetailsDto dto) throws InvalidDataExeception {
        foodDetailValidator.validate(dto);
        if (!foodRepository.existsById(dto.getFoodId())) {
            throw new InvalidDataExeception("FoodId not exists");
        }
        FoodDetails entity = foodDetailMapper.convertToEntity(dto);
        Food food = new Food();
        food.setId(dto.getFoodId());
        entity.setFood(food);
        if (dto.getFoodMedias() != null) {
            entity.setFoodMedias(
                    dto.getFoodMedias().stream()
                            .map(foodMediaDto -> foodMedialMapper.convertToEntity(foodMediaDto))
                            .collect(Collectors.toList())
            );
        }

        FoodDetails result = foodDetallsRepository.save(entity);
        return foodDetailMapper.convertToDto(result);
    }

    @Override
    public FoodDetailsDto update(Long id, FoodDetailsDto dto) throws InvalidDataExeception {
        foodDetailValidator.validate(dto);

        if (!foodDetallsRepository.existsById(id)) {
            throw new InvalidDataExeception("foodDetails-id not exists!");
        }

        log.info("Someone edit category id-" + id);
        FoodDetails entity = foodDetailMapper.convertToEntity(dto);
        entity.setId(id);

        return foodDetailMapper.convertToDto(
                foodDetallsRepository.save(entity));

    }

    @Override
    public FoodDetailsDto getById(Long id) {
        return foodDetailMapper.convertToDto(
                foodDetallsRepository.findById(id).orElse(null));
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!foodDetallsRepository.existsById(id)) {
            throw new InvalidDataExeception("The foodDetails[id] not found");
        }

        log.info("Someone delete category id-" + id);
        foodDetallsRepository.deleteById(id);
        return true;
    }

    @Override
    public List<FoodDetailsDto> getAll() {
        return foodDetailMapper
                .convertToListDto(foodDetallsRepository.findAll());
    }

    @Override
    public List<FoodDetailsDto> getAll(Pageable pageable) {
        return null;
    }

}
