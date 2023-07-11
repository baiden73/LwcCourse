public with sharing class ConController {
    
    // create an AuraEnabled method to return a list of related contact records
    @AuraEnabled
    public static List<Contact> getContactList(String accountId) {

        // return a list of related contact records
        return [SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    }
}