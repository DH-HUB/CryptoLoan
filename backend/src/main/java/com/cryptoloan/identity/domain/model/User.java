package com.cryptoloan.identity.domain.model;
import java.time.Instant;import java.util.Set;
public record User(Long id,String name,String email,String passwordHash,Set<String> roles,boolean enabled,Instant createdAt){
  public User{roles=Set.copyOf(roles);}
  public static User register(String name,String email,String passwordHash){return new User(null,name.trim(),email.trim().toLowerCase(),passwordHash,Set.of("ROLE_USER"),true,Instant.now());}
}

