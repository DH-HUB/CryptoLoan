package com.cryptoloan.loanposition.domain.port.out;

import com.cryptoloan.loanposition.domain.model.LoanPositionStatus;
import java.math.BigDecimal;
import java.util.List;

public final class LoanPositionPorts {
    private LoanPositionPorts() {}

    public interface LoanReader {
        List<LoanSnapshot> findByBorrower(String borrowerEmail);
    }

    public record LoanSnapshot(
        BigDecimal amountEur,
        String collateralSymbol,
        BigDecimal collateralAmount,
        LoanPositionStatus status
    ) {}
}
