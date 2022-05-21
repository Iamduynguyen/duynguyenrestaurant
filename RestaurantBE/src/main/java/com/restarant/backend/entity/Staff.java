package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Staff.
 */
@Entity
@Table(name = "staff")
public class Staff implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "sequenceGenerator")
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

    @OneToMany(mappedBy = "staff")
    @JsonIgnoreProperties(value = { "tableOrders", "payment", "customer", "staff" }, allowSetters = true)
    private Set<OrderTotal> orderTotals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Staff id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Staff name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Staff phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return this.email;
    }

    public Staff email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return this.gender;
    }

    public Staff gender(String gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Long getDeleteflag() {
        return this.deleteflag;
    }

    public Staff deleteflag(Long deleteflag) {
        this.setDeleteflag(deleteflag);
        return this;
    }

    public void setDeleteflag(Long deleteflag) {
        this.deleteflag = deleteflag;
    }

    public Set<OrderTotal> getOrderTotals() {
        return this.orderTotals;
    }

    public void setOrderTotals(Set<OrderTotal> orderTotals) {
        if (this.orderTotals != null) {
            this.orderTotals.forEach(i -> i.setStaff(null));
        }
        if (orderTotals != null) {
            orderTotals.forEach(i -> i.setStaff(this));
        }
        this.orderTotals = orderTotals;
    }

    public Staff orderTotals(Set<OrderTotal> orderTotals) {
        this.setOrderTotals(orderTotals);
        return this;
    }

    public Staff addOrderTotal(OrderTotal orderTotal) {
        this.orderTotals.add(orderTotal);
        orderTotal.setStaff(this);
        return this;
    }

    public Staff removeOrderTotal(OrderTotal orderTotal) {
        this.orderTotals.remove(orderTotal);
        orderTotal.setStaff(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Staff)) {
            return false;
        }
        return id != null && id.equals(((Staff) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Staff{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", email='" + getEmail() + "'" +
            ", gender='" + getGender() + "'" +
            ", deleteflag=" + getDeleteflag() +
            "}";
    }
}
