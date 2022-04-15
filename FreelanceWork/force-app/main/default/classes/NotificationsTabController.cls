public with sharing class NotificationsTabController {
    @AuraEnabled
    public static List<Notification__c> getNotifications(String userId) {
        List<Notification__c> notifications = getNotificationsByUserId(userId);

        return notifications;
    }


    @AuraEnabled
    public static void deleteNotification(String notificationId) {
        List<Notification__c> notifications = getNotificationsById(notificationId);
        Notification__c notification = notifications[0];

        delete notification;
    }

    private static List<Notification__c> getNotificationsByUserId(String userId) {
        List<Notification__c> notifications = [
            SELECT  Id,
                ImageURL__c,    
                Customer__r.ImageURL__c,
                Customer__r.Id,
                Freelancer__r.ImageURL__c,
                Freelancer__r.Id,
                Name,
                Text__c,
                Title__c
            FROM Notification__c 
            WHERE (Customer__c = :userId OR Freelancer__c = :userId)
        ];
            
        return notifications;
    }

    private static List<Notification__c> getNotificationsById(String id) {
        List<Notification__c> notifications = [
            SELECT  Id,
                ImageURL__c,    
                Customer__r.ImageURL__c,
                Customer__r.Id,
                Freelancer__r.ImageURL__c,
                Freelancer__r.Id,
                Name,
                Text__c,
                Title__c
            FROM Notification__c 
            WHERE Id = :id
        ];
            
        return notifications;
    }

    
}
