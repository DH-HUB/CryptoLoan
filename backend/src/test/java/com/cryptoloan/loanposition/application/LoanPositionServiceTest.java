package com.cryptoloan.loanposition.application;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.cryptoloan.loanposition.domain.model.LoanPositionStatus;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanReader;
import com.cryptoloan.loanposition.domain.port.out.LoanPositionPorts.LoanSnapshot;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class LoanPositionServiceTest {

    @Test
    void calculatesSummaryAndGroupsActiveCollateralByCrypto() {
        LoanReader reader = email -> List.of(
            loan("1000", "btc", "0.10", LoanPositionStatus.PENDING),
            loan("2500", "BTC", "0.25", LoanPositionStatus.APPROVED),
            loan("1500", "eth", "1.50", LoanPositionStatus.APPROVED),
            loan("700", "btc", "0.05", LoanPositionStatus.LIQUIDATED)
        );

        var summary = new LoanPositionService(reader).summaryFor("alice@example.com");

        assertEquals(4, summary.totalLoans());
        assertEquals(1, summary.pendingLoans());
        assertEquals(2, summary.approvedLoans());
        assertEquals(1, summary.liquidatedLoans());
        assertEquals(new BigDecimal("4700"), summary.totalBorrowedEur());
        assertEquals(new BigDecimal("4000"), summary.outstandingEur());
        assertEquals(2, summary.collateralByCrypto().size());
        assertEquals("BTC", summary.collateralByCrypto().get(0).symbol());
        assertEquals(new BigDecimal("0.35"), summary.collateralByCrypto().get(0).quantity());
        assertEquals("ETH", summary.collateralByCrypto().get(1).symbol());
        assertEquals(new BigDecimal("1.50"), summary.collateralByCrypto().get(1).quantity());
    }

    @Test
    void asksThePortOnlyForTheAuthenticatedBorrowerData() {
        Map<String, List<LoanSnapshot>> data = Map.of(
            "alice@example.com", List.of(loan("1000", "btc", "0.10", LoanPositionStatus.APPROVED)),
            "bob@example.com", List.of(
                loan("2000", "eth", "2", LoanPositionStatus.PENDING),
                loan("3000", "eth", "3", LoanPositionStatus.APPROVED)
            )
        );
        LoanReader reader = email -> data.getOrDefault(email, List.of());
        LoanPositionService service = new LoanPositionService(reader);

        var alice = service.summaryFor("alice@example.com");
        var bob = service.summaryFor("bob@example.com");

        assertEquals(1, alice.totalLoans());
        assertEquals(new BigDecimal("1000"), alice.outstandingEur());
        assertEquals(2, bob.totalLoans());
        assertEquals(new BigDecimal("3000"), bob.outstandingEur());
        assertEquals(new BigDecimal("5"), bob.collateralByCrypto().get(0).quantity());
    }

    @Test
    void returnsAnEmptySummaryWhenTheBorrowerHasNoLoans() {
        var summary = new LoanPositionService(email -> List.of()).summaryFor("nobody@example.com");

        assertEquals(0, summary.totalLoans());
        assertEquals(BigDecimal.ZERO, summary.totalBorrowedEur());
        assertEquals(BigDecimal.ZERO, summary.outstandingEur());
        assertEquals(List.of(), summary.collateralByCrypto());
    }

    private static LoanSnapshot loan(String amount, String symbol, String collateral, LoanPositionStatus status) {
        return new LoanSnapshot(new BigDecimal(amount), symbol, new BigDecimal(collateral), status);
    }
}
