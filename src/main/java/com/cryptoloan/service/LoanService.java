package com.cryptoloan.service;

import com.cryptoloan.domain.Loan;
import com.cryptoloan.repository.LoanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoanService {
    private final LoanRepository loanRepository;

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan createLoan(Loan loan) {
        return loanRepository.save(loan);
    }
}
