public with sharing class CaseFormController {
    @AuraEnabled
    public static Case__c createCase(
        String title, 
        String text,
        String userId,
        String role
    ) {
        Case__c case2 = new Case__c();

        case2.Title__c = title;
        case2.Text__c = text;
        case2.Status__c = '';
        case2.Name = 'Case from ' + userId;

        if(role == 'Customer'){
            case2.Customer__c = userId;
        }else if(role == 'Freelancer'){
            case2.Freelancer__c = userId;
        }

        insert case2;

        return case2;
    }
}
