package com.restarant.backend.dto;

import lombok.Data;

import java.util.Objects;

@Data
public class FoodMediaDto {
    private Long id;
    private String foodUrl;
    private String foodType;
    private Long foodDetailId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FoodMediaDto that = (FoodMediaDto) o;
        return Objects.equals(id, that.id) && Objects.equals(foodUrl, that.foodUrl) && Objects.equals(foodType, that.foodType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, foodUrl, foodType);
    }
}
