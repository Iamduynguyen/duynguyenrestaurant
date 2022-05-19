package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * A Customer.
 */
@Data
@Entity
@Table(name = "customer")
@SQLDelete(sql = "UPDATE customer SET deleteflag = 1 WHERE id = ?")
//@Where(clause = "deleteflag = 0")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private String gender;

    @Column(name = "deleteflag")
    private Long deleteflag = 0L;

    @JsonIgnore
    @OneToOne(mappedBy = "customer", fetch = FetchType.LAZY)
    private Account account;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "tableOrders", "payment", "customer", "staff" }, allowSetters = true)
    private Set<OrderTotal> orderTotals = new HashSet<>();

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "customer" }, allowSetters = true)
    private Set<Voucher> vouchers = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "customer_favourite_food",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "food_details_id"))
    private Set<FoodDetails> favouriteFood = new LinkedHashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id) && Objects.equals(name, customer.name) && Objects.equals(phoneNumber, customer.phoneNumber) && Objects.equals(email, customer.email) && Objects.equals(gender, customer.gender) && Objects.equals(deleteflag, customer.deleteflag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, phoneNumber, email, gender, deleteflag);
    }


}

