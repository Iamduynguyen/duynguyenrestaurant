package com.restarant.backend.service.impl;

import com.restarant.backend.dto.FoodMediaDto;
import com.restarant.backend.entity.FoodMedia;
import com.restarant.backend.repository.FoodDetallsRepository;
import com.restarant.backend.repository.FoodMediaRepository;
import com.restarant.backend.service.IFoodMediaService;
import com.restarant.backend.service.mapper.impl.FoodMediaMapper;
import com.restarant.backend.service.validate.FoodMediaValidator;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class FoodMediaService implements IFoodMediaService {

    private final FoodMediaRepository foodMediaRepository;
    private final FoodMediaMapper mapper;
    private final FoodDetallsRepository foodDetallsRepository;
    private final FoodMediaValidator validator = new FoodMediaValidator();

    public FoodMediaService(FoodMediaRepository foodMediaRepository,
                            FoodMediaMapper mapper,
                            FoodDetallsRepository foodDetallsRepository) {
        this.foodMediaRepository = foodMediaRepository;
        this.mapper = mapper;
        this.foodDetallsRepository = foodDetallsRepository;
    }

    @Override
    public FoodMediaDto create(FoodMediaDto dto) throws InvalidDataExeception {
        validator.validate(dto);

        if (!foodDetallsRepository.existsById(dto.getFoodDetailId())) {
            throw new InvalidDataExeception("foodDetailId not exists");
        }

        log.info("Someone create category " + dto);
        FoodMedia result = foodMediaRepository.save(
                mapper.convertToEntity(dto));

        return mapper.convertToDto(result);
    }

    @Override
    public FoodMediaDto update(Long id, FoodMediaDto dto) throws InvalidDataExeception {
        validator.validate(dto);
        if (!foodDetallsRepository.existsById(id)) {
            throw new InvalidDataExeception("foodDetailId not exists");
        }

        log.info("Someone edit category id-" + id);
        FoodMedia foodMedia = mapper.convertToEntity(dto);
        foodMedia.setId(id);
        return mapper.convertToDto(
                foodMediaRepository.save(foodMedia));
    }

    @Override
    public FoodMediaDto getById(Long id) {
        return mapper.convertToDto(
                foodMediaRepository.findById(id).get());
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!foodMediaRepository.existsById(id)) {
            throw new InvalidDataExeception("The foodMedia[id] not found");
        }

        log.info("Someone delete category id-" + id);
        foodMediaRepository.deleteById(id);
        return true;
    }

    @Override
    public List<FoodMediaDto> getAll() {
        return null;
    }

    @Override
    public List<FoodMediaDto> getAll(Pageable pageable) {
        return null;
    }
}
