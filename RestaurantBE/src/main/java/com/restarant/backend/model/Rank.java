package com.restarant.backend.model;

import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum Rank {
    RANK1(new RankDiscount(500000, 5, 50000)),
    RANK2(new RankDiscount(1000000, 10, 100000)),
    RANK3(new RankDiscount(1500000, 15, 150000)),
    RANK4(new RankDiscount(2000000, 20, 200000)),
    RANK5(new RankDiscount(3000000, 30, 300000));

    private RankDiscount rankDiscount;

    Rank(RankDiscount rankDiscount) {
        this.rankDiscount = rankDiscount;
    }

    @Data
    public static class RankDiscount {
        BigDecimal amountTotal;
        int percent;
        BigDecimal maxMoney;

        public RankDiscount(long amountTotal, int percent, long money) {
            this.amountTotal = new BigDecimal(amountTotal);
            this.percent = percent;
            this.maxMoney = new BigDecimal(money);
        }
    }

    public static Rank getRanking(BigDecimal money) {
        Rank[] ranks = Rank.values();
        for (int i = ranks.length - 1; i >= 0; i--) {
            if (money.compareTo(
                    ranks[i].getRankDiscount().amountTotal) >= 0) {
                return ranks[i];
            }
        }
        return null;
    }


}
