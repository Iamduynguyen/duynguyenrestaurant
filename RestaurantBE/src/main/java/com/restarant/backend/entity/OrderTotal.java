package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

/**
 * A OrderTotal.
 */
@Data
@Entity
@Table(name = "order_total")
@SQLDelete(sql = "UPDATE order_total SET deleteflag = 1 WHERE id = ?")
@Where(clause = "deleteflag = 0")
public class OrderTotal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "voucher")
    private Long voucher;

    @Column(name = "amount_totail", precision = 21, scale = 2)
    private BigDecimal amountTotal;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @Column(name = "status")
    private Integer status;

    @Column(name = "order_time")
    private Long orderTime;

    @Column(name = "end_time")
    private Long endTime;

    @Column(name = "deposit")
    private BigDecimal deposit;

    @Column(name = "note")
    private String note;

    @Column(name = "create_at")
    private Long createdAt;

    @OneToMany(mappedBy = "orderTotal", cascade = CascadeType.ALL)
    @JsonIgnoreProperties(value = {"orderDetails", "tables", "orderTotal"}, allowSetters = true)
    private Set<TableOrder> tableOrders = new HashSet<>();

    @JsonIgnoreProperties(value = {"orderTotal"}, allowSetters = true)
    @OneToOne(mappedBy = "orderTotal")
    private Payment payment;

    @ManyToOne
    @JsonIgnoreProperties(value = {"orderTotals", "vouchers"}, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(value = {"orderTotals"}, allowSetters = true)
    private Staff staff;


    public BigDecimal getAmountTotal() {
        BigDecimal total = new BigDecimal(0);
        for (TableOrder tableOrder : tableOrders) {
            if (tableOrder != null) {
                total = total.add(tableOrder.getTotal());
            }
        }
        return total;
    }



}
