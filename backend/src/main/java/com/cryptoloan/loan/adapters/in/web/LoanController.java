
package com.cryptoloan.loan.adapters.in.web;

import com.cryptoloan.loan.application.LoanService;
import com.cryptoloan.loan.domain.model.Loan;
import com.cryptoloan.loan.domain.model.LoanStatus;
import com.cryptoloan.shared.security.AuthenticatedUser;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
@Tag(
    name = "Prêts",
    description = "Gestion des prêts garantis par des crypto-actifs"
)
@SecurityRequirement(name = "bearerAuth")
class LoanController {

    private final LoanService service;

    LoanController(LoanService service) {
        this.service = service;
    }

    @Operation(
        summary = "Créer un prêt",
        description = "Enregistre une demande de prêt garantie par des crypto-actifs."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Demande enregistrée"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Données invalides"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Authentification requise"
        )
    })
    @PostMapping
    LoanResponse create(
        @AuthenticationPrincipal AuthenticatedUser user,

        @Parameter(
            description = "Clé permettant d'éviter la création de doublons"
        )
        @RequestHeader(
            value = "Idempotency-Key",
            required = false
        )
        UUID key,

        @Valid @RequestBody Request request
    ) {
        return LoanResponse.from(
            service.create(
                key == null ? UUID.randomUUID() : key,
                user.email(),
                user.displayName(),
                request.amountEur(),
                request.collateralSymbol(),
                request.collateralAmount(),
                request.liquidationRatio()
            )
        );
    }

    @Operation(
        summary = "Consulter mes prêts",
        description = "Retourne les prêts de l'utilisateur authentifié."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Liste des prêts"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Authentification requise"
        )
    })
    @GetMapping
    List<LoanResponse> mine(
        @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return service.mine(user.email())
            .stream()
            .map(LoanResponse::from)
            .toList();
    }

    @Operation(
        summary = "Consulter tous les prêts",
        description = "Retourne l'ensemble des prêts. Accès administrateur."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Liste complète des prêts"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Authentification requise"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès réservé aux administrateurs"
        )
    })
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    List<LoanResponse> all() {
        return service.all()
            .stream()
            .map(LoanResponse::from)
            .toList();
    }

    @Operation(
        summary = "Approuver un prêt",
        description = "Permet à un administrateur d'approuver un prêt."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Prêt approuvé"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Authentification requise"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Accès réservé aux administrateurs"
        )
    })
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    LoanResponse approve(
        @PathVariable Long id,
        @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return LoanResponse.from(
            service.approve(id, user.email())
        );
    }

    record Request(
        @NotNull
        @DecimalMin("1.00")
        BigDecimal amountEur,

        @NotBlank
        String collateralSymbol,

        @NotNull
        @DecimalMin("0.00000001")
        BigDecimal collateralAmount,

        @DecimalMin("1.00")
        BigDecimal liquidationRatio
    ) {}

    record LoanResponse(
        Long id,
        String borrowerEmail,
        String borrowerName,
        BigDecimal amountEur,
        String collateralSymbol,
        BigDecimal collateralAmount,
        BigDecimal liquidationRatio,
        LoanStatus status,
        BigDecimal lastObservedRatio,
        Instant createdAt,
        Instant approvedAt,
        Instant liquidatedAt
    ) {
        static LoanResponse from(Loan loan) {
            return new LoanResponse(
                loan.id(),
                loan.borrowerEmail(),
                loan.borrowerName(),
                loan.amountEur(),
                loan.collateralSymbol(),
                loan.collateralAmount(),
                loan.minimumRatio(),
                loan.status(),
                loan.lastObservedRatio(),
                loan.createdAt(),
                loan.approvedAt(),
                loan.liquidatedAt()
            );
        }
    }
}