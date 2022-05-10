package com.restarant.backend.dto;

import com.restarant.backend.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

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
public class GetAllToTalOrder {
    private Long id;
    private Long voucher;
    private BigDecimal discount;
    private BigDecimal amountTotal;
    private Integer status;
    private Long orderTime;
    private Long endTime;
    private BigDecimal deposit;
    private String note;
    private Long createdAt;
    private CustomerOrderDto customer;
    List<GetTableOrDer> orders;
}
