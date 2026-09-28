package com.cryptoloan.loanposition.adapters.in.web;

import com.cryptoloan.loanposition.domain.port.in.LoanPositionUseCase;
import com.cryptoloan.loanposition.domain.model.LoanPositionSummary;
import com.cryptoloan.shared.security.AuthenticatedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@Tag(name = "Portefeuille", description = "Vue synthétique de la position de prêts de l'utilisateur")
@SecurityRequirement(name = "bearerAuth")
class LoanPositionController {
    private final LoanPositionUseCase useCase;

    LoanPositionController(LoanPositionUseCase useCase) {
        this.useCase = useCase;
    }

    @Operation(
        summary = "Résumé du portefeuille",
        description = "Calcule côté serveur le résumé des prêts de l'utilisateur authentifié."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Résumé calculé"),
        @ApiResponse(responseCode = "401", description = "Authentification requise")
    })
    @GetMapping("/summary")
    SummaryResponse summary(@AuthenticationPrincipal AuthenticatedUser user) {
        return SummaryResponse.from(useCase.summaryFor(user.email()));
    }

    record SummaryResponse(
        long totalLoans,
        long pendingLoans,
        long approvedLoans,
        long liquidatedLoans,
        BigDecimal totalBorrowedEur,
        BigDecimal outstandingEur,
        List<CollateralResponse> collateralByCrypto
    ) {
        static SummaryResponse from(LoanPositionSummary summary) {
            return new SummaryResponse(
                summary.totalLoans(),
                summary.pendingLoans(),
                summary.approvedLoans(),
                summary.liquidatedLoans(),
                summary.totalBorrowedEur(),
                summary.outstandingEur(),
                summary.collateralByCrypto().stream().map(CollateralResponse::from).toList()
            );
        }
    }

    record CollateralResponse(String symbol, BigDecimal quantity) {
        static CollateralResponse from(LoanPositionSummary.CollateralSummary collateral) {
            return new CollateralResponse(collateral.symbol(), collateral.quantity());
        }
    }
}
