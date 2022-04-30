package com.restarant.backend.service;

import com.restarant.backend.dto.CategoryDto;
import com.restarant.backend.entity.Category;
import com.restarant.backend.model.Pages;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICategoryService extends IServiceAdapter<CategoryDto>{
    Pages getPage(Pageable pageable);
}
