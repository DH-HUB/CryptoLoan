package com.cryptoloan.notification.application;
import static org.junit.jupiter.api.Assertions.*;import com.cryptoloan.notification.domain.model.Notification;import com.cryptoloan.notification.domain.port.out.NotificationPorts.*;import java.util.*;import org.junit.jupiter.api.Test;
class NotificationServiceTest{
 @Test void sendsEmailToHakTestUser(){List<String> recipients=new ArrayList<>();Repository repo=new MemoryRepository();EmailSender mail=(to,subject,message)->recipients.add(to);LivePublisher live=n->{};Notification result=new NotificationService(repo,mail,live).notify("noreply@example.com","INFO_TEST","Test","Message",null);assertEquals(Notification.Status.SENT,result.status());assertEquals(List.of("noreply@example.com"),recipients);}
 @Test void recordsSmtpFailure(){Repository repo=new MemoryRepository();EmailSender mail=(to,subject,message)->{throw new IllegalStateException("SMTP offline");};Notification result=new NotificationService(repo,mail,n->{}).notify("noreply@example.com","INFO_TEST","Test","Message",null);assertEquals(Notification.Status.FAILED,result.status());}
 static class MemoryRepository implements Repository{long id;public Notification save(Notification n){return new Notification(n.id()==null?++id:n.id(),n.recipient(),n.type(),n.subject(),n.message(),n.loanId(),n.status(),n.error(),n.createdAt());}public List<Notification>findForRecipient(String r){return List.of();}}
}

