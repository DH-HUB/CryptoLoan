package com.cryptoloan.loan.domain.model;
import java.math.BigDecimal;import java.time.Instant;import java.util.UUID;
public record Loan(Long id,UUID requestId,String borrowerEmail,String borrowerName,BigDecimal amountEur,String collateralSymbol,BigDecimal collateralAmount,BigDecimal minimumRatio,LoanStatus status,boolean warningSent,BigDecimal lastObservedRatio,Instant createdAt,Instant approvedAt,Instant liquidatedAt,String contractHash){
 public static Loan create(UUID requestId,String email,String name,BigDecimal amount,String symbol,BigDecimal collateral,BigDecimal minimumRatio){return new Loan(null,requestId,email,name,amount,symbol.toLowerCase(),collateral,minimumRatio,LoanStatus.PENDING,false,null,Instant.now(),null,null,null);}
 public Loan approve(String contractHash){if(status!=LoanStatus.PENDING)throw new IllegalStateException("Seul un prêt en attente peut être approuvé");return copy(LoanStatus.APPROVED,warningSent,lastObservedRatio,Instant.now(),null,contractHash);}
 public Loan warn(BigDecimal ratio){return new Loan(id,requestId,borrowerEmail,borrowerName,amountEur,collateralSymbol,collateralAmount,minimumRatio,status,true,ratio,createdAt,approvedAt,liquidatedAt,contractHash);}
 public Loan observeHealthy(BigDecimal ratio){return new Loan(id,requestId,borrowerEmail,borrowerName,amountEur,collateralSymbol,collateralAmount,minimumRatio,status,false,ratio,createdAt,approvedAt,liquidatedAt,contractHash);}
 public Loan observe(BigDecimal ratio){return new Loan(id,requestId,borrowerEmail,borrowerName,amountEur,collateralSymbol,collateralAmount,minimumRatio,status,warningSent,ratio,createdAt,approvedAt,liquidatedAt,contractHash);}
 public Loan liquidate(BigDecimal ratio){if(status==LoanStatus.LIQUIDATED)return this;return new Loan(id,requestId,borrowerEmail,borrowerName,amountEur,collateralSymbol,collateralAmount,minimumRatio,LoanStatus.LIQUIDATED,warningSent,ratio,createdAt,approvedAt,Instant.now(),contractHash);}
 private Loan copy(LoanStatus newStatus,boolean warning,BigDecimal ratio,Instant approved,Instant liquidated,String hash){return new Loan(id,requestId,borrowerEmail,borrowerName,amountEur,collateralSymbol,collateralAmount,minimumRatio,newStatus,warning,ratio,createdAt,approved,liquidated,hash);}
}

