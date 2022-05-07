package com.restarant.backend.service;

import com.restarant.backend.dto.CustomerDto;
import com.restarant.backend.dto.FavouriteFoodDto;
import com.restarant.backend.dto.FeedbackDto;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.model.Pages;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.springframework.data.domain.Pageable;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface IFeedbackService extends IServiceAdapter<FeedbackDto>  {
    List<FeedbackDto> getAll(Pageable pageable);
    FeedbackDto createFeedbackByCustomer(HttpServletRequest request, CustomerDto dto,FeedbackDto feedbackDto) throws InvalidDataExeception;
//    Pages getPage(Pageable pageable);
  //  List<FeedbackDto> getbyQuery(Pageable pageable, String query);
//    List<FeedbackDto> getById(Pageable pageable, Long id);
}
