package com.cryptoloan.identity.domain.port.out;
import com.cryptoloan.identity.domain.model.User;import java.util.Optional;
public final class IdentityPorts{private IdentityPorts(){}public interface UserRepository{Optional<User> findByEmail(String email);User save(User user);}public interface TokenIssuer{String issue(User user);}}

