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
 * @since 5/21/2022 3:06 PM
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDto {
 private String passwordOld;
 private String passwordNew;
 private String passwordConfirm;
}
