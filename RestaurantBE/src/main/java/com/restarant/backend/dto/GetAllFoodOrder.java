package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Description:
 *
 * @author: POLY_DuyDVPH12712
 * @version: 1.0
 * @since: 5/10/2022
 * Project_name: Tech-cam
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllFoodOrder {
    private Long id;
    private Long orderTableId;
    private Long foodDetailsId;
    private String foodName;
    private String size;
    private Long quantity;
    private BigDecimal discount;
    private BigDecimal amount;
    private String note;
}
