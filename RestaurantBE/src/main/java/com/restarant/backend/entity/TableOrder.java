package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A TableOrder.
 */

@Entity
@Table(name = "table_order")
@SQLDelete(sql = "UPDATE table_order SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class TableOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @OneToMany(mappedBy = "tableOrder", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = {"foodDetalls", "tableOrder"}, allowSetters = true)
    private Set<OrderDetails> orderDetails = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = {"tableOrders"}, allowSetters = true)
    private Tables tables;

    @ManyToOne
    @JsonIgnoreProperties(value = {"tableOrders", "payment", "customer", "staff"}, allowSetters = true)
    private OrderTotal orderTotal;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TableOrder that = (TableOrder) o;
        return id == null? false : Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public BigDecimal getTotal() {
        BigDecimal total = new BigDecimal(0);
        for (OrderDetails order : orderDetails) {
            if (order != null) {
                total = total.add(order.getTotal());
            }
        }
        return total;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDeleteflag() {
        return deleteflag;
    }

    public void setDeleteflag(Long deleteflag) {
        this.deleteflag = deleteflag;
    }

    public Set<OrderDetails> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(Set<OrderDetails> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public Tables getTables() {
        return tables;
    }

    public void setTables(Tables tables) {
        this.tables = tables;
    }

    public OrderTotal getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(OrderTotal orderTotal) {
        this.orderTotal = orderTotal;
    }
}
