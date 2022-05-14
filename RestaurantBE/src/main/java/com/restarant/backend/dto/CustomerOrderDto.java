package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
public class CustomerOrderDto {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String gender;
}
