package com.restarant.backend.dto;

import com.restarant.backend.entity.Customer;
import lombok.Data;

@Data
public class FeedbackDto {
private Long id;
private String content;
private Long created;
private Customer idCustomer;
}
