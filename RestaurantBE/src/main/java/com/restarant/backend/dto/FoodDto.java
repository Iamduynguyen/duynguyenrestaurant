package com.restarant.backend.dto;

import lombok.Data;

import java.util.List;
import java.util.Objects;
import java.util.Set;

@Data
public class FoodDto {
    private Long id;
    private String title;
    private String name;
    private String avtUrl;
    private Integer countDetail;
    private Integer views;
    private Integer sold;
    private Long notes;
    private CategoryDto category;
    private List<FoodDetailsDto> foodDetails;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FoodDto foodDto = (FoodDto) o;
        return id == null? false : Objects.equals(id, foodDto.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
