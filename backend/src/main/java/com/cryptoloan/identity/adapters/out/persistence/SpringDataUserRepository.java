package com.cryptoloan.identity.adapters.out.persistence;import java.util.Optional;import org.springframework.data.jpa.repository.JpaRepository;interface SpringDataUserRepository extends JpaRepository<UserJpaEntity,Long>{Optional<UserJpaEntity> findByEmail(String email);}

