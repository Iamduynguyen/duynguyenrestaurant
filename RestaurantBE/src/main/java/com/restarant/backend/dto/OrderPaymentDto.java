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
 * @since: 5/7/2022
 * Project_name: Tech-cam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPaymentDto {
    private Long orderId;
    private Long voucherId;
    private String nameCust;
    private String phoneNumberCust;
    private BigDecimal returnCustMoney;
    private BigDecimal custMoney;
}
