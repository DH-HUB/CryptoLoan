package com.cryptoloan;

import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
public class CryptoCollateral {
    @Id
    private String cryptoType;  // bitcoin, ethereum
    private Double value;       // Valeur actuelle de la garantie
}
