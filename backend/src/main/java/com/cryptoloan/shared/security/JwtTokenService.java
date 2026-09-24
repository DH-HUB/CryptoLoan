package com.cryptoloan.shared.security;
import com.cryptoloan.identity.domain.model.User;import com.cryptoloan.identity.domain.port.out.IdentityPorts.TokenIssuer;import io.jsonwebtoken.*;import io.jsonwebtoken.security.Keys;import java.nio.charset.StandardCharsets;import java.time.Instant;import java.util.*;import javax.crypto.SecretKey;import org.springframework.beans.factory.annotation.Value;import org.springframework.security.core.authority.SimpleGrantedAuthority;import org.springframework.stereotype.Component;
@Component public class JwtTokenService implements TokenIssuer{
 private final SecretKey key;private final long expiration;
 public JwtTokenService(@Value("${cryptoloan.jwt.secret}")String secret,@Value("${cryptoloan.jwt.expiration-seconds}")long expiration){if(secret.length()<32)throw new IllegalStateException("JWT_SECRET doit contenir au moins 32 caractères");this.key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));this.expiration=expiration;}
 public String issue(User user){Instant now=Instant.now();return Jwts.builder().setSubject(user.email()).claim("name",user.name()).claim("roles",user.roles()).setIssuedAt(Date.from(now)).setExpiration(Date.from(now.plusSeconds(expiration))).signWith(key,SignatureAlgorithm.HS256).compact();}
 public AuthenticatedUser parse(String token){Claims c=Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();List<?> roles=c.get("roles",List.class);var authorities=roles.stream().map(Object::toString).map(SimpleGrantedAuthority::new).toList();return new AuthenticatedUser(c.getSubject(),Objects.toString(c.get("name"),c.getSubject()),authorities);}
}

