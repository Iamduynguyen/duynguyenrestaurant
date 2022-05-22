package com.restarant.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restarant.backend.entity.FoodDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThanhtoanDto implements Serializable {
    private Long id;
    private BigDecimal amountTotal;
    private String foodName;
    private String foodSize;
    private Long sl;
    private BigDecimal tongtien;
}
