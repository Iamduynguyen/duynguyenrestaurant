package com.restarant.backend.dto;

import com.restarant.backend.entity.Customer;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedbackDto {
private Long id;
private String content;
private LocalDate created;
private Long idCustomer;
private Customer customer;
}
