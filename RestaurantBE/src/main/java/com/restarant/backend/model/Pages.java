package com.restarant.backend.model;

import lombok.Data;
import org.springframework.data.domain.Page;

@Data
public class Pages {
    private int totalPage;
    private long totalElement;
    private int currentPage;
    private int currentSize;

    public Pages(int totalPage, int totalElement, int currentPage, int currentSize) {
        this.totalPage = totalPage;
        this.totalElement = totalElement;
        this.currentPage = currentPage;
        this.currentSize = currentSize;
    }

    public Pages(Page<?> page){
        this.totalPage = page.getTotalPages();
        this.totalElement = page.getTotalElements();
        this.currentPage = page.getNumber();
        this.currentSize = page.getSize();
    }
}
