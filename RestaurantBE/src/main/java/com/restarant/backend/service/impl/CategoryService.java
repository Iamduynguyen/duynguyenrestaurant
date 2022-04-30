package com.restarant.backend.service.impl;

import com.restarant.backend.dto.CategoryDto;
import com.restarant.backend.entity.Category;
import com.restarant.backend.model.Pages;
import com.restarant.backend.repository.CategoryRepository;
import com.restarant.backend.service.ICategoryService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final IConverterDto<Category, CategoryDto> categoryMapper;

    public CategoryService(CategoryRepository categoryRepository,
                           @Qualifier("categoryMapper") IConverterDto<Category, CategoryDto> categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public CategoryDto create(CategoryDto categoryDto) {

        log.info("Someone create category " + categoryDto);

        Category result = categoryRepository.save(
                categoryMapper.convertToEntity(categoryDto)
        );
        return categoryMapper.convertToDto(result);
    }

    @Override
    public CategoryDto getById(Long id) {
        return categoryMapper.convertToDto(
                categoryRepository.findById(id).orElse(null)
        );
    }

    @Override
    public CategoryDto update(Long id, CategoryDto categoryDto) {
        if (categoryRepository.existsById(id)) {

            log.info("Someone edit category id-" + id);
            Category category = categoryMapper.convertToEntity(categoryDto);
            category.setId(id);
            return categoryMapper.convertToDto(
                    categoryRepository.save(category)
            );
        }
        return null;
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        if (!categoryRepository.existsById(id)) {
            throw new InvalidDataExeception("The category[id] not found");
        }

        log.info("Someone delete category id-" + id);
        categoryRepository.deleteById(id);
        return true;
    }

    @Override
    public List<CategoryDto> getAll() {
        return (List<CategoryDto>) categoryMapper.convertToListDto(
                categoryRepository.findAll()
        );
    }

    @Override
    public List<CategoryDto> getAll(Pageable pageable) {
        return (List<CategoryDto>) categoryMapper.convertToListDto(
                categoryRepository.findAll(pageable).getContent()
        );
    }

    @Override
    public Pages getPage(Pageable pageable) {
        return new Pages(categoryRepository.findAll(pageable));
    }
}
