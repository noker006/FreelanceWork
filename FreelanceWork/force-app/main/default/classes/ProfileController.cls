public with sharing class ProfileController {
    
    @AuraEnabled
    public static SObject getUser(
        String id
    ) {
        List<Freelancer__c> freelancers = getFreelancers(id);
        List<Customer__c> customers = getCustomers(id);
    
        if(!freelancers.isEmpty()) {
            Freelancer__c freelancer = new Freelancer__c();
            freelancer = freelancers[0];
            return freelancer;
        } else if(!customers.isEmpty()) {
            Customer__c customer = new Customer__c();
            customer = customers[0];
            return customer;
        } else {
            Freelancer__c freelancer = new Freelancer__c();
            return freelancer;
        }
    }

    @AuraEnabled
    public static SObject changeUser(
        String id,  	
        String email,
        String name, 
        String password,
        String imageURL
    ) {
        List<Freelancer__c> freelancers = getFreelancers(id);
        List<Customer__c> customers = getCustomers(id);
    
        if(!freelancers.isEmpty()) {
            Freelancer__c freelancer = new Freelancer__c();
            freelancer = freelancers[0];
            freelancer.Email__c = email;
            freelancer.Name =name;
            freelancer.Password__c = password;
            freelancer.ImageURL__c = imageURL;
            update freelancer;
            return freelancer;
        } else if(!customers.isEmpty()) {
            Customer__c customer = new Customer__c();
            customer = customers[0];
            customer.Email__c = email;
            customer.Name =name;
            customer.Password__c = password;
            customer.ImageURL__c = imageURL;
            update customer;
            return customer;
        } else {
            Freelancer__c freelancer = new Freelancer__c();
            return freelancer;
        }
    }
    
    private static List<Freelancer__c> getFreelancers(
        String id
    ) {
        List<Freelancer__c> freelancers = [
            SELECT Id, 	
                    Email__c, 
                    Name , 
                    Password__c, 
                    Username__c, 
                    CreatedDate,
                    ImageURL__c
            FROM Freelancer__c 
            WHERE Id = :id 
        ];
        
        return freelancers;
    }

    private static List<Customer__c> getCustomers(String id){
        List<Customer__c> customer = [
            SELECT Id, 	
                    Email__c, 
                    Name , 
                    Password__c, 
                    Username__c, 
                    CreatedDate,
                    ImageURL__c
            FROM Customer__c 
            WHERE Id = :id 
        ];
        
        return customer;
    }
}
