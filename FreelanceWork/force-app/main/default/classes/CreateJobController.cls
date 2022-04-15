public with sharing class CreateJobController {

    @AuraEnabled
    public static Job__c createJob(
        String category, 
        String description, 
        String duration, 
        String experienceLevel,
        Decimal fullPayment,
        String hourlyRate,
        String name,
        List<String> skills,
        String customerId
    ) {
        Job__c job = new Job__c();

        job.Category__c = category;
        job.Description__c = description;
        job.Duration__c = duration;
        job.ExperienceLevel__c = experienceLevel;
        job.FullPayment__c = fullPayment;
        job.HourlyRate__c = hourlyRate;
        job.Name = name;
        job.Customer__c = customerId;
        job.Status__c = 'Waiting';

        String skillsLine = '';
        Integer counter = 0;
        for(String skill : skills){
            if(counter == (skills.size() - 1)) {
                skillsLine += skill;
            }
            skillsLine += skill + ';';
        }
        job.Skills__c = skillsLine;

        insert job;

        return job;
    }

}
