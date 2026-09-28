package com.cryptoloan.loanposition.domain.port.in;

import com.cryptoloan.loanposition.domain.model.LoanPositionSummary;

public interface LoanPositionUseCase {
    LoanPositionSummary summaryFor(String borrowerEmail);
}
