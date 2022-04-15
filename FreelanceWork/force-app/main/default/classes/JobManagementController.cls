public with sharing class JobManagementController {
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
    public static List<Request__c> getRequests(String jobId) {
        List<Request__c> requests;

        if(String.isBlank(jobId)) {
            requests = new  List<Request__c>();

            return requests;
        }

        List<Job__c> jobs = getJobsByIdWithRequests(jobId);
        requests = jobs[0].Requests__r;

        return requests;
    }

    @AuraEnabled
    public static Freelancer__c getFreelancer(String freelancerId) {
        Freelancer__c freelancer;

        if(String.isBlank(freelancerId)) {
            freelancer = new Freelancer__c();

            return freelancer;
        }

        List<Freelancer__c> freelancers = getFreelancers(freelancerId);
        freelancer = freelancers[0];

        return freelancer;
    }

    @AuraEnabled
    public static void changeRequestStatus(String requestId, String status) {
        List<Request__c> requests = getRequestsById(requestId);
        Request__c request = requests[0];

        request.Status__c = status;

        update request;
    }

    @AuraEnabled
    public static void createContract(String freelancerId, String jobId, String requestId) {
        List<Freelancer__c> freelancers = getFreelancers(freelancerId);
        Freelancer__c freelancer = freelancers[0];
        List<Job__c> jobs = getJobsById(jobId);
        Job__c job = jobs[0];
        List<Request__c> requests = getRequestsById(requestId);
        Request__c request = requests[0];

        Contract__c contract = new Contract__c();
        contract.Name = freelancer.Name + '-' + job.Name;
        contract.DeadLine__c = request.DeadLine__c;
        contract.Freelancer__c = freelancerId;
        contract.FullPayment__c = request.FullPayment__c;
        contract.HourlyRate__c = request.HourlyRate__c;
        contract.Job__c = jobId;
        contract.Status__c = 'Waiting';

        insert contract;
    }

    @AuraEnabled
    public static List<Freelancer__c> getAllFreelancers(String jobId, String status) {
        List<Freelancer__c> freelancers = new  List<Freelancer__c>(); 
        List<Job__c> jobs = getJobsByIdWithContracts(jobId, status);
        List<Contract__c> contracts = jobs[0].Contracts__r;
        List<String> freelancerIds = new List<String>();

        for(Contract__c contract: contracts){
            freelancerIds.add(contract.Freelancer__c);
        }

        freelancers = getFreelancersByIds(freelancerIds);

        return freelancers;
    }

    @AuraEnabled
    public static Job__c changeJobStatus(String jobId) {
        List<Job__c> jobs = getJobsByIdWithContract(jobId);
        Job__c job = jobs[0];
        List<Contract__c> contracts = job.Contracts__r;

        for(Contract__c contract : contracts){
            contract.Status__c = 'In process';
        }

        job.Status__c = 'In process';

        update job;
        update contracts;
        
        return job;
    }

    @AuraEnabled
    public static Job__c closeJob(String jobId, String script) {
        List<Job__c> jobs = getJobsByIdWithContract(jobId);
        Job__c job = jobs[0];
        List<Contract__c> contracts = job.Contracts__r;

        for(Contract__c contract : contracts){
            contract.Status__c = 'Done';
        }

        job.Status__c = 'Done';

        update job;
        update contracts;

        if(script == 'Bad'){
            removeReputation(contracts);
        } else if(script == 'Good') {
            addReputation(contracts);
        }

        return job;
    }

    @AuraEnabled
    public static void addReputation(List<Contract__c>  contracts) {
        List<String> freelancerIds = new  List<String>();

        for(Contract__c contract : contracts){
            freelancerIds.add(contract.Freelancer__r.Id);
        }

        List<Freelancer__c> freelancers = getFreelancersByIds(freelancerIds);

        for(Freelancer__c freelancer:freelancers){
            if(freelancer.Rating__c  == null) {
                freelancer.Rating__c = 0;
            }

            freelancer.Rating__c += 5;
        }

        update freelancers;
    }

    @AuraEnabled
    public static void removeReputation(List<Contract__c>  contracts) {
        List<String> freelancerIds = new  List<String>();

        for(Contract__c contract : contracts){
            freelancerIds.add(contract.Freelancer__r.Id);
        }

        List<Freelancer__c> freelancers = getFreelancersByIds(freelancerIds);

        for(Freelancer__c freelancer:freelancers){
            freelancer.Rating__c -= 5;
        }

        update freelancers;
    }

    @AuraEnabled
    public static Notification__c createNotificationByScript(String jobId, String freelancerId, String script) {
        Notification__c notification = new Notification__c();
        if(String.isBlank(jobId) || String.isBlank(freelancerId)) {
            return notification;
        }

        List<Job__c> jobs = getJobsById(jobId);
        Job__c job = jobs[0];

        List<Freelancer__c>  freelancers = getFreelancers(freelancerId);
        Freelancer__c freelancer = freelancers[0];

        notification.Freelancer__c = freelancer.Id;
        
        if(!String.isBlank(job.Customer__r.ImageURL__c)){
            notification.ImageURL__c = job.Customer__r.ImageURL__c;
        }
        notification.Name = job.Customer__r.Username__c + '-' + job.Id;

        if(script == 'Rejected'){
            notification.Text__c = 'Your request was Rejected by customer: ' + job.Customer__r.Name + '[' + job.Customer__r.Username__c + ']';
            notification.Title__c = 'Your request was Rejected on Job: ' + job.Name;
        } else if(script == 'Confirmed'){
            notification.Text__c = 'Your request was Confirmed by customer: ' + job.Customer__r.Name + '[' + job.Customer__r.Username__c + ']';
            notification.Title__c = 'Your request was Confirmed on Job: ' + job.Name;
        }
       
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
                Customer__r.Id,
                Customer__r.ImageURL__c,
                Customer__r.Name,
                Customer__r.Username__c
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
    

    private static List<Freelancer__c> getFreelancersByIds(List<String> Ids) {
        List<Freelancer__c> freelancers = [
            SELECT  Id, 
                Email__c, 
                Name, 
                ImageURL__c, 
                Username__c, 
                Rating__c 
            FROM Freelancer__c 
            WHERE Id IN :Ids 
        ];
        
        return freelancers;
    }
    
    private static List<Job__c> getJobsByIdWithRequests(String jobId) {
        List<Job__c> jobs = [
            SELECT  id,
                Category__c, 
                Description__c, 
                ExperienceLevel__c,
                HourlyRate__c,
                Name,
                Skills__c,
                Status__c,
                (
                    SELECT  FullPayment__c,
                        HourlyRate__c,
                        DeadLine__c,
                        Message__c,
                        Id,
                        Freelancer__r.Name,
                        Freelancer__r.ImageURL__c,
                        Freelancer__r.Id, 
                        Status__c
                    FROM Requests__r 
                    WHERE Status__c = ''
                )
            FROM Job__c 
            WHERE Id =: jobId
        ];
        
        return jobs;
    }

    private static List<Request__c> getRequestsById(String requestId) {
        List<Request__c> requests = [
            SELECT FullPayment__c,
                HourlyRate__c,
                DeadLine__c,
                Message__c,
                Id,
                Freelancer__r.Name,
                Freelancer__r.ImageURL__c,
                Freelancer__r.Id,
                Status__c
            FROM Request__c 
            WHERE Id =: requestId
        ];
        
        return requests;
    }

    private static List<Job__c> getJobsByIdWithContracts(String jobId, String status) {
        List<Job__c> jobs = [
            SELECT  Id,
                Category__c, 
                Description__c, 
                ExperienceLevel__c,
                HourlyRate__c,
                Name,
                Skills__c,
                Status__c,
                (
                    SELECT Id,
                        Name,
                        DeadLine__c,
                        Freelancer__c,
                        FullPayment__c,
                        HourlyRate__c,
                        Job__c,
                        Status__c
                    FROM  Contracts__r
                    WHERE Status__c = :status
                )
            FROM Job__c 
            WHERE Id =: jobId
        ];
        
        return jobs;
    }

    private static List<Job__c> getJobsByIdWithContract(String jobId) {
        List<Job__c> jobs = [
            SELECT  id,
                Category__c, 
                Description__c, 
                ExperienceLevel__c,
                HourlyRate__c,
                Name,
                Skills__c,
                Status__c,
                (
                    SELECT Status__c, 
                        Id,
                        Freelancer__r.Id
                    FROM Contracts__r 
                )
            FROM Job__c 
            WHERE Id =: jobId
        ];
        
        return jobs;
    }

}
