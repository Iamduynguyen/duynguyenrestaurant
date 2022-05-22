package com.restarant.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restarant.backend.entity.FoodDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;


public class ThanhtoanDto implements Serializable {
    private Long foodDetails;
    private Integer sl;

    public ThanhtoanDto(Long foodDetails, Integer sl) {
        this.foodDetails = foodDetails;
        this.sl = sl;
    }

    public ThanhtoanDto() {
    }

    public Long getFoodDetails() {
        return foodDetails;
    }

    public void setFoodDetails(Long foodDetails) {
        this.foodDetails = foodDetails;
    }

    public Integer getSl() {
        return sl;
    }

    public void setSl(Integer sl) {
        this.sl = sl;
    }
}
