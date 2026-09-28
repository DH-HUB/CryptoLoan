package com.cryptoloan.loanposition.domain.model;

import java.math.BigDecimal;
import java.util.List;

public record LoanPositionSummary(
    long totalLoans,
    long pendingLoans,
    long approvedLoans,
    long liquidatedLoans,
    BigDecimal totalBorrowedEur,
    BigDecimal outstandingEur,
    List<CollateralSummary> collateralByCrypto
) {
    public record CollateralSummary(String symbol, BigDecimal quantity) {}
}
