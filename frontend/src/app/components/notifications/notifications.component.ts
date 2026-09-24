import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { AppNotification, NotificationApi } from '../../services/notification.api';

@Component({selector:'app-notifications',standalone:true,imports:[CommonModule],templateUrl:'./notifications.component.html'})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  loading = true;
  feedback = '';
  private sub = new Subscription();
  constructor(private api: NotificationApi) {}
  ngOnInit(){this.sub.add(interval(15000).pipe(startWith(0),switchMap(()=>this.api.list())).subscribe({next:v=>{this.notifications=v;this.loading=false;},error:()=>{this.feedback='Impossible de charger les notifications.';this.loading=false;}}));}
  sendTest(){this.feedback='Envoi en cours…';this.api.sendTest().subscribe({next:n=>{this.feedback=n.status==='SENT'?'E-mail de test envoyé. Consultez votre boîte ou Mailpit.':'E-mail enregistré mais en échec SMTP.';this.notifications=[n,...this.notifications];},error:()=>this.feedback="Échec de l'envoi de test."});}
  ngOnDestroy(){this.sub.unsubscribe();}
}

