public with sharing class LoginFormController {

    public class Wrapper {
        @AuraEnabled
        public String userId{get;set;}
        @AuraEnabled
        public String role{get;set;}
    }

    @AuraEnabled
    public static Wrapper checkUser(
        String email,
        String password,
        String role
    ) {
        String  userId ;
        Wrapper wrapper = new Wrapper();
        if(role == 'Freelancer') {
            List<Freelancer__c> freelancers = getFreelancersByEmailAndPassword(email, password);
            
            if(!freelancers.isEmpty()) {
                wrapper.userId = freelancers[0].Id;
                wrapper.role = 'Freelancer';
            } else {
                wrapper.userId = 'User not found';
            }
        } else if(role == 'Customer') {
            List<Customer__c> customers = getCustomersByEmailAndPassword(email, password);

            if(!customers.isEmpty()){
                wrapper.userId = customers[0].Id;
                wrapper.role = 'Customer';
            } else {
                wrapper.userId = 'User not found';
            }
        }

        return wrapper;
    }

    private static List<Customer__c> getCustomersByEmailAndPassword(
        String email,
        String password
    ) {
        List<Customer__c> customers = [
            SELECT Email__c
            FROM Customer__c 
            WHERE Email__c  =: email 
            AND Password__c =: password
        ];
        
        return customers;
    }
    
    private static List<Freelancer__c> getFreelancersByEmailAndPassword(
        String email,
        String password
    ) {
        List<Freelancer__c> freelancers = [
            SELECT Email__c
            FROM Freelancer__c 
            WHERE Email__c  =: email 
            AND Password__c =: password
        ];
        
        return freelancers;
    }
}
