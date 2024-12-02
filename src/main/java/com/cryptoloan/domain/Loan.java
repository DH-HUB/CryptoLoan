package com.cryptoloan.domain;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Clé primaire

    private BigDecimal amount; // Montant du prêt
    private BigDecimal liquidationRatio; // Ratio de liquidation

    @ManyToOne
    private User user; // Relation avec l'utilisateur

    @OneToOne(cascade = CascadeType.ALL)
    private CryptoCollateral collateral; // Relation avec la garantie

    @Enumerated(EnumType.STRING)
    private LoanStatus status; // Statut du prêt
}
