package com.restarant.backend.service.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Description:
 *
 * @author: POLY_DuyDVPH12712
 * @version: 1.0
 * @since: 5/7/2022
 * Project_name: Tech-cam
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailDto {
    private String from;
    private String to;
    private String subject;
    private String body;
}