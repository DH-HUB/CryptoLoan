package com.cryptoloan.loan.adapters.in.loanposition;

import com.cryptoloan.loan.domain.model.Loan;
import com.cryptoloan.loan.domain.port.out.LoanPorts.Repository;
import com.cryptoloan.loanposition.domain.model.LoanPositionStatus;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanReader;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanSnapshot;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
class LoanPositionLoanReaderAdapter implements LoanReader {
    private final Repository loans;

    LoanPositionLoanReaderAdapter(Repository loans) {
        this.loans = loans;
    }

    @Override
    public List<LoanSnapshot> findByBorrower(String borrowerEmail) {
        return loans.findByBorrower(borrowerEmail).stream()
            .map(LoanPositionLoanReaderAdapter::snapshot)
            .toList();
    }

    private static LoanSnapshot snapshot(Loan loan) {
        return new LoanSnapshot(
            loan.amountEur(),
            loan.collateralSymbol(),
            loan.collateralAmount(),
            LoanPositionStatus.valueOf(loan.status().name())
        );
    }
}
