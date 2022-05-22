package com.restarant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDto {
    private String name;
    private String phoneNumber;
    private String email;
    private String gender;
    private String password;
}
