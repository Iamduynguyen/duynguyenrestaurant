package com.restarant.backend.web.controller;

import com.restarant.backend.dto.FeedbackDto;
import com.restarant.backend.entity.Feedback;
import com.restarant.backend.repository.FeedbackRepository;
import com.restarant.backend.service.IFeedbackService;
import com.restarant.backend.service.validate.exception.InvalidDataExeception;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Transactional
@CrossOrigin("*")
public class FeedbackController {
    private final Logger log = LoggerFactory.getLogger(FeedbackController.class);

    private static final String ENTITY_NAME = "feedback";

    private final FeedbackRepository feedbackRepository;
    private final IFeedbackService feedbackService;
    public FeedbackController(FeedbackRepository feedbackRepository, IFeedbackService feedbackService) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackService = feedbackService;
    }

    @PostMapping("/feedbacks")
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackDto feedbackDto) throws URISyntaxException {
        log.debug("REST request to save feedback : {}", feedbackDto);
        try {
            FeedbackDto result = feedbackService.create(feedbackDto);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
        //    log.debug("done feedback");
        } catch (InvalidDataExeception e) {
            log.error("Error when create Feedback", e);
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @GetMapping("/feedbacks")
    public List<Feedback> getAllFeedback() {
        log.debug("REST request to get all Feedback");
        return feedbackRepository.findAll();
    }
    @GetMapping("/feedbacks/{id}")
    public ResponseEntity<?> getFeedback(@PathVariable Long id) {
        log.debug("REST request to get Feedback : {}", id);
        Optional<Feedback> feedback = feedbackRepository.findById(id);
        return ResponseEntity.ok(feedback.get());
    }
}
