package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * A Food.
 */
@Data
@Entity
@Table(name = "food")
@SQLDelete(sql = "UPDATE food SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "jhi_create")
    private LocalDate create;

    @Column(name = "name")
    private String name;

    @Column(name = "views")
    private Long views;

    @Column(name = "notes")
    private Long notes;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @OneToMany(mappedBy = "food")
    @JsonIgnoreProperties(value = { "food" }, allowSetters = true)
    private List<Comment> comments;

    @OneToMany(mappedBy = "food", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "foodMedias", "orderDetails", "food" }, allowSetters = true)
    private List<FoodDetails> foodDetails;

    @ManyToOne
    @JsonIgnoreProperties(value = { "foods" }, allowSetters = true)
    private Category category;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Food food = (Food) o;
        return id == null? false : id.equals(food.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Food{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", create=" + create +
                ", name='" + name + '\'' +
                ", views=" + views +
                ", notes=" + notes +
                ", deleteflag=" + deleteflag +
                '}';
    }
}
