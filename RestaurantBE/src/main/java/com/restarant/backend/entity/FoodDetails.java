package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * A FoodDetalls.
 */
@Data
@Entity
@Table(name = "food_detalls")
@SQLDelete(sql = "UPDATE food_detalls SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class FoodDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "foodsize")
    private String foodsize;

    @Column(name = "discount", precision = 21, scale = 2)
    private BigDecimal discount;

    @Column(name = "amount", precision = 21, scale = 2)
    private BigDecimal amount;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "foodDetalls" }, allowSetters = true)
    @JoinColumn(name = "FOOD_DETALLS_ID")
    private List<FoodMedia> foodMedias;

    @OneToMany(mappedBy = "foodDetalls", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties(value = { "foodDetalls", "tableOrder" }, allowSetters = true)
    private List<OrderDetails> orderDetails ;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "comments", "foodDetalls", "category" }, allowSetters = true)
    private Food food;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "favouriteFood")
    private List<Customer> customers;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FoodDetails that = (FoodDetails) o;
        return id == null? false : Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }


}
