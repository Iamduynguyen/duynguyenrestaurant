package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Description:
 *
 * @author: GMO_ThanhND
 * @version: 1.0
 * @since 5/21/2022 11:10 PM
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderHistoryDto {
 private Long id;
 private String date;
 private String startTime;
 private String endTime;
 private String tables;
 private String amountTotal;
 private String paymentType;
}
