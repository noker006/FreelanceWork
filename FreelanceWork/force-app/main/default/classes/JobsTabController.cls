public with sharing class JobsTabController {

    private static final String basicQuery = ' SELECT  id, Category__c, Description__c, '
        + 'ExperienceLevel__c, HourlyRate__c, Name, Skills__c, Customer__r.Name, Customer__r.ImageURL__c, Customer__r.Id ' 
        + 'FROM Job__c '
        + 'WHERE Status__c = \'Waiting\' ' 
        + 'LIMIT 4 '
        + 'OFFSET :offset';

    private static final String  baseQuery = ' SELECT  id, Category__c, Description__c, '
    + 'ExperienceLevel__c, HourlyRate__c, Name, Skills__c ' 
    + 'FROM Job__c '
    + 'WHERE Status__c = \'Waiting\' ';


    public class Wrapper {
        @AuraEnabled
        public List<Job__c> jobs{get;set;}
        @AuraEnabled
        public Integer offset{get;set;}
    }

    @AuraEnabled
    public static List<String> getPicklistValues(String ObjectApi_name, String Field_name) {
        List<String> lstPickvals = new List<String>();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(ObjectApi_name);
        Sobject Object_name = targetType.newSObject();
        Schema.sObjectType sobject_type = Object_name.getSObjectType();
        Schema.DescribeSObjectResult sobject_describe = sobject_type.getDescribe();
        Map<String, Schema.SObjectField> field_map = sobject_describe.fields.getMap();
        List<Schema.PicklistEntry> pick_list_values = field_map.get(Field_name).getDescribe().getPickListValues();
        for (Schema.PicklistEntry a : pick_list_values) {
            lstPickvals.add(a.getValue());
        }
        return lstPickvals;
    }
    
    @AuraEnabled
    public static String getQueryWithFilters(String expLevel){
        String query = baseQuery;

        if(!String.isBlank(expLevel)){
            query += 'AND ' + 'ExperienceLevel__c = \'' + expLevel + '\'' + ' ';
        }

        query += 'LIMIT 4 ' + 'OFFSET :offset';

        return query;
    }
    
    @AuraEnabled
    public static Wrapper getJobs(String query, Integer offset) {
        if(query == '') {
            query = basicQuery;
        }

        Wrapper wrapper =  new Wrapper();
        List<Job__c> jobs = getJobsByQuery(query, offset);
        offset += jobs.size();

        wrapper.jobs = jobs;
        wrapper.offset = offset;
        
        return wrapper;
    }

    private static List<Job__c> getJobsByQuery(String query, Integer offset){
        List<Job__c> jobs = Database.query(query);

        return jobs;
    }

    private static List<Job__c> getWaitingJobs(Integer offset) {
        List<Job__c> jobs = [
            SELECT  id,
                Category__c, 
                Description__c, 
                ExperienceLevel__c,
                HourlyRate__c,
                Name
            FROM Job__c 
            WHERE Status__c = 'Waiting' 
            LIMIT 4
            OFFSET :offset
        ];
        
        return jobs;
    }
}
