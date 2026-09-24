package com.cryptoloan.shared.security;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
public record AuthenticatedUser(String email,String displayName,Collection<? extends GrantedAuthority> authorities) implements UserDetails{
  public String getUsername(){return email;}public String getPassword(){return "N/A";}public boolean isAccountNonExpired(){return true;}public boolean isAccountNonLocked(){return true;}public boolean isCredentialsNonExpired(){return true;}public boolean isEnabled(){return true;}public Collection<? extends GrantedAuthority> getAuthorities(){return authorities;}
}

