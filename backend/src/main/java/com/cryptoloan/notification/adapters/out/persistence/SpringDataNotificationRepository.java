package com.cryptoloan.notification.adapters.out.persistence;import java.util.List;import org.springframework.data.jpa.repository.JpaRepository;interface SpringDataNotificationRepository extends JpaRepository<NotificationJpaEntity,Long>{List<NotificationJpaEntity>findByRecipientOrderByCreatedAtDesc(String recipient);}

