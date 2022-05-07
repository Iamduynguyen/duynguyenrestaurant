package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
@Data
@Entity
@Table(name = "feedback")
public class Feedback implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
     private Long id;

    @Column(name="content",length = 1000)
    private String content;

    @Column(name="created")
    private LocalDate created;


    @ManyToOne
    @JsonIgnoreProperties(value = {"orderTotals", "vouchers","feedback"}, allowSetters = true)
    private Customer customer;
}
