package com.cryptoloan.loanposition.application;

import com.cryptoloan.loanposition.domain.model.LoanPositionStatus;
import com.cryptoloan.loanposition.domain.model.LoanPositionSummary;
import com.cryptoloan.loanposition.domain.port.in.LoanPositionUseCase;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanReader;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanSnapshot;
import java.math.BigDecimal;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;

@Service
public class LoanPositionService implements LoanPositionUseCase {
    private final LoanReader loans;

    public LoanPositionService(LoanReader loans) {
        this.loans = loans;
    }

    @Override
    public LoanPositionSummary summaryFor(String borrowerEmail) {
        var userLoans = loans.findByBorrower(borrowerEmail);

        long pending = 0;
        long approved = 0;
        long liquidated = 0;
        BigDecimal totalBorrowed = BigDecimal.ZERO;
        BigDecimal outstanding = BigDecimal.ZERO;
        Map<String, BigDecimal> collateral = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

        for (LoanSnapshot loan : userLoans) {
            if (loan.status() == LoanPositionStatus.PENDING) {
                pending++;
            } else if (loan.status() == LoanPositionStatus.APPROVED) {
                approved++;
                totalBorrowed = totalBorrowed.add(loan.amountEur());
                outstanding = outstanding.add(loan.amountEur());
            } else if (loan.status() == LoanPositionStatus.LIQUIDATED) {
                liquidated++;
                totalBorrowed = totalBorrowed.add(loan.amountEur());
            }

            if (loan.status() != LoanPositionStatus.LIQUIDATED) {
                String symbol = loan.collateralSymbol().toUpperCase(Locale.ROOT);
                collateral.merge(symbol, loan.collateralAmount(), BigDecimal::add);
            }
        }

        var collateralByCrypto = collateral.entrySet().stream()
            .map(entry -> new LoanPositionSummary.CollateralSummary(entry.getKey(), entry.getValue()))
            .toList();

        return new LoanPositionSummary(
            userLoans.size(),
            pending,
            approved,
            liquidated,
            totalBorrowed,
            outstanding,
            collateralByCrypto
        );
    }
}
