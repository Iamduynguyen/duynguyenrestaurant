package com.restarant.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Component
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
//@Where(clause = "delete_flag = 0")
public class Account {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "login")
    private String login;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "secret")
    private String cecret;

    @Column(name = "timereset")
    private LocalDate timereset;

    @OneToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "delete_flag")
    private Boolean deleteFlag;

}
