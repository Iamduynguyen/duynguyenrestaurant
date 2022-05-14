package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Description:
 *
 * @author: POLY_DuyDVPH12712
 * @version: 1.0
 * @since: 5/7/2022
 * Project_name: Tech-cam
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditOrderDetails {
    private Long orderDetailsId;
    private int quantity;
}
