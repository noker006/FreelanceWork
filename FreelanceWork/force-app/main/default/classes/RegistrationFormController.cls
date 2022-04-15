public with sharing class RegistrationFormController {

        @AuraEnabled
        public static String createUser(
            String firstName, 
            String lastName, 
            String userName, 
            String email, 
            String password,
            String role
        ) {
            String message;
            if(role == 'Freelancer'){
                system.debug('userName: ' + userName);
                List<Freelancer__c> freelancers = getFreelancersByUserName(userName);
                system.debug('freelancers: ' + freelancers);
                if(freelancers.isEmpty()) {
                    Freelancer__c user = new Freelancer__c ( 
                        Name = firstName + ' ' + lastName, 
                        Email__c = email, 
                        Password__c = password, 
                        Username__c = userName
                    );

                    insert user;
                    message = user.Id;
                    
                } else {
                    message = 'There is already a user with the same username';
                }
            } else if(role == 'Customer') {
                List<Customer__c> customers = getCustomersByUserName(userName);
                if(customers.isEmpty()){
                    Customer__c user = new Customer__c( 
                        Name = firstName + ' ' + lastName, 
                        Email__c = email, 
                        Password__c = password, 
                        Username__c = userName
                    );
                    
                    insert user;
                    message = user.Id;

                } else {
                    message = 'There is already a user with the same username';
                }
            }
    
            return message;
        }
    
        private static List<Customer__c> getCustomersByUserName(String userName){
            List<Customer__c> customers = [
                SELECT 	Username__c 
                FROM Customer__c 
                WHERE Username__c =: userName
            ];
            
            return customers;
        }

        private static List<Freelancer__c> getFreelancersByUserName(String userName){
            List<Freelancer__c> freelancers = [
                SELECT 	Username__c 
                FROM Freelancer__c 
                WHERE Username__c =: userName
            ];
            
            return freelancers;
        }
}
