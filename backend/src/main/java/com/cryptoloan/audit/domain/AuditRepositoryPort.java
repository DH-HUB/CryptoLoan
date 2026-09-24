package com.cryptoloan.audit.domain;import java.util.List;public interface AuditRepositoryPort{void append(AuditEvent event);List<AuditEvent>recent();}

