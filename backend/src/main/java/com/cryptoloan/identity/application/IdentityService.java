package com.cryptoloan.identity.application;
import com.cryptoloan.identity.domain.model.User;import com.cryptoloan.identity.domain.port.out.IdentityPorts.*;import java.time.Instant;import java.util.Set;import org.springframework.security.crypto.password.PasswordEncoder;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;
@Service public class IdentityService{
 private final UserRepository users;private final TokenIssuer tokens;private final PasswordEncoder passwords;
 public IdentityService(UserRepository users,TokenIssuer tokens,PasswordEncoder passwords){this.users=users;this.tokens=tokens;this.passwords=passwords;}
 @Transactional public User register(String name,String email,String password){String normalized=email.trim().toLowerCase();if(users.findByEmail(normalized).isPresent())throw new IllegalArgumentException("Cette adresse e-mail est déjà utilisée");return users.save(User.register(name,normalized,passwords.encode(password)));}
 public LoginResult login(String email,String password){User user=users.findByEmail(email.trim().toLowerCase()).filter(User::enabled).orElseThrow(()->new IllegalArgumentException("Identifiants invalides"));if(!passwords.matches(password,user.passwordHash()))throw new IllegalArgumentException("Identifiants invalides");return new LoginResult(tokens.issue(user),user);}
 @Transactional public void seedDemoUsers(boolean enabled){if(!enabled)return;seed("Admin","admin@example.com","admin123",Set.of("ROLE_ADMIN"));seed("User","user@example.com","user123",Set.of("ROLE_USER"));seed("Admin","admin@example.com"," admin123",Set.of("ROLE_USER"));}
 private void seed(String name,String email,String password,Set<String> roles){if(users.findByEmail(email).isEmpty())users.save(new User(null,name,email,passwords.encode(password),roles,true,Instant.now()));}
 public record LoginResult(String token,User user){}
}

