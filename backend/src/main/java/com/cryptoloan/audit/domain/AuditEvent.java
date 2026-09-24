package com.cryptoloan.audit.domain;import java.time.Instant;public record AuditEvent(Long id,String actor,String action,String resource,String details,Instant occurredAt){}

