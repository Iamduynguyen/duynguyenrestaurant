package com.restarant.backend.service.impl;

import com.restarant.backend.dto.FeedbackDto;
import com.restarant.backend.entity.Feedback;
import com.restarant.backend.entity.Food;
import com.restarant.backend.repository.CustomerRepository;
import com.restarant.backend.repository.FeedbackRepository;
import com.restarant.backend.service.IFeedbackService;
import com.restarant.backend.service.mapper.IConverterDto;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service("feedbackService")
public class FeedbackService implements IFeedbackService{
    private final FeedbackRepository feedbackRepository;
    private final IConverterDto<Feedback, FeedbackDto> mapper;
    private final CustomerRepository customerRepository;

public FeedbackService(FeedbackRepository feedbackRepository,
                       @Qualifier("feedbackMapper")IConverterDto<Feedback
                               ,FeedbackDto> mapper
                        , CustomerRepository customerRepository){
    this.customerRepository =customerRepository;
    this.feedbackRepository = feedbackRepository;
    this.mapper = mapper;
}

    @Override
    public FeedbackDto create(FeedbackDto feedbackDto) throws InvalidDataExeception {
    if(feedbackDto == null){
        throw new InvalidDataExeception("food must not be null");
    }

        if(feedbackDto.getIdCustomer() != null && feedbackDto.getIdCustomer().getId() != null){
            if(!customerRepository.existsById(feedbackDto.getIdCustomer().getId())){
                throw new InvalidDataExeception("category-id not found");
            }
        }

        Feedback feedback = mapper.convertToEntity(feedbackDto);
        feedback.setCreated(LocalDate.now());

        log.info(String.format("Someone create Food[id-%d]", feedbackDto.getId()));

        Feedback result = feedbackRepository.save(feedback);
        return mapper.convertToDto(result);
    }

    @Override
    public FeedbackDto update(Long id, FeedbackDto dto) throws InvalidDataExeception {
        return null;
    }

    @Override
    public List<FeedbackDto> getAll(Pageable pageable) {
        List<Feedback> feedbacks = feedbackRepository.findAll(pageable).getContent();
        return mapper.convertToListDto(feedbacks);
    }

    @Override
    public FeedbackDto createFeedbackByCustomer(Long id) {
        return null;
    }

//    @Override
//    public Pages getPage(Pageable pageable) {
//        return new Pages(feedbackRepository.findAll(pageable));
//    }

//    @Override
//    public List<FeedbackDto> getbyQuery(Pageable pageable, String query) {
//        return mapper.convertToListDto(feedbackRepository.getByQuery(pageable,query).getContent());
//    }


    @Override
    public FeedbackDto getById(Long id) {
        Feedback feedback = feedbackRepository.findById(id).orElse(null);
        return mapper.convertToDto(feedback);
    }

    @Override
    public boolean deleteById(Long id) throws InvalidDataExeception {
        return false;
    }

    @Override
    public List<FeedbackDto> getAll() {
        return null;
    }

}
