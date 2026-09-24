package com.cryptoloan.identity.adapters.out.persistence;
import jakarta.persistence.*;import java.time.Instant;import java.util.HashSet;import java.util.Set;
@Entity @Table(name="users") class UserJpaEntity{@Id @GeneratedValue(strategy=GenerationType.IDENTITY)Long id;@Column(nullable=false,length=120)String name;@Column(nullable=false,unique=true,length=254)String email;@Column(name="password_hash",nullable=false,length=100)String passwordHash;@Column(nullable=false)boolean enabled;@Column(name="created_at",nullable=false)Instant createdAt;@ElementCollection(fetch=FetchType.EAGER)@CollectionTable(name="user_roles",joinColumns=@JoinColumn(name="user_id"))@Column(name="role",nullable=false,length=40)Set<String> roles=new HashSet<>();}

