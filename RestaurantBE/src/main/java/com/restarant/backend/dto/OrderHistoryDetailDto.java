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
 * @since 5/22/2022 3:07 PM
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderHistoryDetailDto {
 private String tableId;
 private String foodName;
 private String foodImage;
 private String quantity;
 private String amount;
}
