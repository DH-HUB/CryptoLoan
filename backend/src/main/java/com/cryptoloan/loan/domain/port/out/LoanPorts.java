package com.cryptoloan.loan.domain.port.out;
import com.cryptoloan.loan.domain.model.*;import java.math.BigDecimal;import java.util.*;
public final class LoanPorts{private LoanPorts(){}
 public interface Repository{Loan save(Loan loan);Optional<Loan>findById(Long id);Optional<Loan>findByRequestId(UUID id);List<Loan>findByBorrower(String email);List<Loan>findAll();List<Loan>findActive();}
 public interface PriceCatalog{BigDecimal eur(String symbol);}
 public interface ContractManagement{ContractResult generate(Loan loan);}
 public interface Notifications{void send(String recipient,String type,String subject,String message,Long loanId);}
 public interface Audit{void record(String actor,String action,String resource,String details);}
 public record ContractResult(String hash,String documentReference){}
}

