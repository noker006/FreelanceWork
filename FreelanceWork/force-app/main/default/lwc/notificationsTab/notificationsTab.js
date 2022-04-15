import { LightningElement, track } from 'lwc';
import getNotifications from '@salesforce/apex/NotificationsTabController.getNotifications';
import deleteNotification from '@salesforce/apex/NotificationsTabController.deleteNotification';

export default class NotificationsTab extends LightningElement {
    @track notifications = [];

    connectedCallback() {
        this.userId = this.searchParams("userId");
        this.getNotifications(this.userId);
        console.log('isconnectedCallback from NotificationsTab');
        console.log( 'this.notifications:' );

        console.log( this.notifications );
        console.log( this.userId );


    }
    
    async getNotifications(userId) {
        let notifications = await getNotifications({
            userId:  userId
        }); 

        this.notifications = notifications;

        this.sendNotificationsChangedEvent();
        console.log( 'notifications from apex ' );

        console.log( notifications );

    }

    searchParams(name){
        let url_string = window.location.href;
        let url = new URL(url_string);

        return url.searchParams.get(name);
    }

    handleDelete(event) {
        let notification = event.detail;
        
        this.deleteFromNotifications(notification);
        this.deleteNotification(notification.Id);

        this.sendNotificationsChangedEvent();
    }

    async deleteNotification(notificationId){
        let notification = await deleteNotification({
            notificationId:  notificationId
        }); 
    }

    deleteFromNotifications(notification) {
        for (let i = 0; i < this.notifications.length; i++) {
            if(this.notifications[i].Id === notification.Id){
                this.notifications.splice(i, 1);
            }
        }
    }

    sendNotificationsChangedEvent(event) {
        const notificationsChangedEvent = new CustomEvent('notificationschanged',{detail: this.notifications});

        this.dispatchEvent(notificationsChangedEvent);
    }
}