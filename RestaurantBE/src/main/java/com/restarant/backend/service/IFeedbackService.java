package com.restarant.backend.service;

import com.restarant.backend.dto.FeedbackDto;
import com.restarant.backend.model.Pages;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IFeedbackService extends IServiceAdapter<FeedbackDto>  {
    List<FeedbackDto> getAll(Pageable pageable);
    FeedbackDto createFeedbackByCustomer(Long id);
//    Pages getPage(Pageable pageable);
  //  List<FeedbackDto> getbyQuery(Pageable pageable, String query);
//    List<FeedbackDto> getById(Pageable pageable, Long id);
}
