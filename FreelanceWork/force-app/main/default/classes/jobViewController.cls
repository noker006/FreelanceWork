public with sharing class jobViewController {
    @AuraEnabled
    public static Job__c getJob( String jobId) {
        Job__c job;
        if(String.isBlank(jobId)) {
            job = new Job__c();
            return job;
        }

        List<Job__c> jobs = getJobsById(jobId);
        job = jobs[0];
        return job;
    }

    @AuraEnabled
    public static Request__c createRequest(String jobId, String freelancerId, Date deadLine,String fullPayment,String message) {
        Request__c request;
        if(String.isBlank(jobId) || String.isBlank(freelancerId)) {
            request = new Request__c();
            return request;
        }

        Decimal dFullPayment = Decimal.valueOf(fullPayment);

        List<Job__c> jobs = getJobsById(jobId);
        Job__c job = jobs[0];

        List<Freelancer__c>  freelancers = getFreelancers(freelancerId);
        Freelancer__c freelancer = freelancers[0];

        request = new Request__c();
        request.DeadLine__c = deadLine;
        request.Freelancer__c = freelancerId;
        request.FullPayment__c = dFullPayment;
        request.Job__c = jobId;
        request.Message__c = message;
        request.Name = job.Id + '-' + freelancer.Name;
        request.Status__c = '';

        insert request;

        return request;
    }

    @AuraEnabled
    public static Notification__c createNotification(String jobId, String freelancerId) {
        Notification__c notification = new Notification__c();
        if(String.isBlank(jobId) || String.isBlank(freelancerId)) {
            return notification;
        }


        List<Job__c> jobs = getJobsById(jobId);
        Job__c job = jobs[0];

        List<Freelancer__c>  freelancers = getFreelancers(freelancerId);
        Freelancer__c freelancer = freelancers[0];

        notification.Customer__c = job.Customer__r.Id;
        
        if(!String.isBlank(freelancer.ImageURL__c)){
            notification.ImageURL__c = freelancer.ImageURL__c;
        }
        notification.Name = freelancer.Username__c + '-' + job.Id;
        notification.Text__c = 'You have new request from freelancer: ' + freelancer.Name + '[' + freelancer.Username__c + ']';
        notification.Title__c = 'You have new request on Job: ' + job.Name;
       
        insert notification;

        return notification;
    }

    private static List<Job__c> getJobsById(String jobId) {
        List<Job__c> jobs = [
            SELECT  id,
                Category__c, 
                Description__c, 
                ExperienceLevel__c,
                HourlyRate__c,
                Name,
                Skills__c,
                Status__c,
                Customer__r.Id
            FROM Job__c 
            WHERE Id =: jobId
        ];
        
        return jobs;
    }


    private static List<Freelancer__c> getFreelancers(String freelancerId) {
        List<Freelancer__c> freelancers = [
            SELECT  Id,
                Email__c, 
                Name, 
                ImageURL__c, 
                Username__c,
                Rating__c
            FROM Freelancer__c 
            WHERE Id =: freelancerId
        ];
        
        return freelancers;
    }
}
