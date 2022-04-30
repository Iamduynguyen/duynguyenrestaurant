package com.restarant.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A Voucher.
 */
@Entity
@Table(name = "voucher")
public class Voucher implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "jhi_percent")
    private Long percent;

    @Column(name = "max_money", precision = 21, scale = 2)
    private BigDecimal maxMoney;

    @Column(name = "created")
    private LocalDate created;

    @Column(name = "title")
    private String title;

    @Column(name = "active")
    private Long active = 0L;

    @Column(name = "deleteflag")
    private long deleteflag = 0L;

    @ManyToOne
    @JsonIgnoreProperties(value = { "orderTotals", "vouchers" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Voucher id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPercent() {
        return this.percent;
    }

    public Voucher percent(Long percent) {
        this.setPercent(percent);
        return this;
    }

    public void setPercent(Long percent) {
        this.percent = percent;
    }

    public BigDecimal getMaxMoney() {
        return this.maxMoney;
    }

    public Voucher maxMoney(BigDecimal maxMoney) {
        this.setMaxMoney(maxMoney);
        return this;
    }

    public void setMaxMoney(BigDecimal maxMoney) {
        this.maxMoney = maxMoney;
    }

    public LocalDate getCreated() {
        return this.created;
    }

    public Voucher created(LocalDate created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }

    public String getTitle() {
        return this.title;
    }

    public Voucher title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getActive() {
        return this.active;
    }

    public Voucher active(Long active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Long active) {
        this.active = active;
    }

    public Long getDeleteflag() {
        return this.deleteflag;
    }

    public Voucher deleteflag(Long deleteflag) {
        this.setDeleteflag(deleteflag);
        return this;
    }

    public void setDeleteflag(Long deleteflag) {
        this.deleteflag = deleteflag;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Voucher customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Voucher)) {
            return false;
        }
        return id != null && id.equals(((Voucher) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Voucher{" +
            "id=" + getId() +
            ", percent=" + getPercent() +
            ", maxMoney=" + getMaxMoney() +
            ", created='" + getCreated() + "'" +
            ", title='" + getTitle() + "'" +
            ", active=" + getActive() +
            ", deleteflag=" + getDeleteflag() +
            "}";
    }
}
