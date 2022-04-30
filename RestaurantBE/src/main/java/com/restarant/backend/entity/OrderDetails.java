package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A OrderDetails.
 */
@Data
@Entity
@Table(name = "order_details")
@SQLDelete(sql = "UPDATE order_details SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class OrderDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private Long quantity = 0L;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @ManyToOne
    @JsonIgnoreProperties(value = {"foodMedias", "orderDetails", "food"}, allowSetters = true)
    private FoodDetails foodDetalls;

    @ManyToOne
    @JsonIgnoreProperties(value = {"orderDetails", "tables", "orderTotal"}, allowSetters = true)
    private TableOrder tableOrder;

    @Column(name = "status")
    private Integer status = 0;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDetails that = (OrderDetails) o;
        return id == null? false : Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public BigDecimal getTotal() {
        if(foodDetalls == null){
            return new BigDecimal("0");
        }
        return foodDetalls.getAmount()
                .multiply(new BigDecimal(quantity));
    }
}
