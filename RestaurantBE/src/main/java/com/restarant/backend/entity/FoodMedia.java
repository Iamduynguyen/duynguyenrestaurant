package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A FoodMedia.
 */
@Data
@Entity
@Table(name = "food_media")
@SQLDelete(sql = "UPDATE food_media SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class FoodMedia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "foodurl")
    private String foodurl;

    @Column(name = "foodtype")
    private String foodType;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FOOD_DETALLS_ID")
    @JsonIgnore
    @JsonIgnoreProperties(value = { "foodMedias", "orderDetails", "food" }, allowSetters = true)
    private FoodDetails foodDetalls;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FoodMedia foodMedia = (FoodMedia) o;
        return id == null? false : id.equals(foodMedia.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
