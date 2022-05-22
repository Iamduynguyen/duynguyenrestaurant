package com.restarant.backend.dto;

import io.swagger.models.auth.In;

import java.math.BigDecimal;


public class Foodpaydto {
    private Long id;
    private String name;
    private String size;
    private BigDecimal gia;
    private Integer sl;
    private BigDecimal tonggia;

    public Foodpaydto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public BigDecimal getGia() {
        return gia;
    }

    public void setGia(BigDecimal gia) {
        this.gia = gia;
    }

    public Integer getSl() {
        return sl;
    }

    public void setSl(Integer sl) {
        this.sl = sl;
    }

    public BigDecimal getTonggia() {
        return tonggia;
    }

    public void setTonggia(BigDecimal tonggia) {
        this.tonggia = tonggia;
    }
}
