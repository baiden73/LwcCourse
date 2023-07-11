public with sharing class OpportunityController {
    
    // Create a public static method that accepts an Account ID as a parameter, and returns a related
    // list of opportunity records.  Annotate the method with AuraEnabled to make it available in our LWC
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String accountId) {

        // create a list to hold he related Opp records
        List<Opportunity> opps = new List<Opportunity>();

        // query the database to return the Opp records related to the Account ID
        opps = [SELECT Id, Name, Amount, StageName, CloseDate, IsWon, IsClosed FROM Opportunity
                    WHERE AccountId = :accountId WITH SECURITY_ENFORCED];

        // if(true) {
        //    throw new myException('Error in apex'); 
        // }
                    

        // return the list of Opp records
        return opps;
    }

    // public class myException extends Exception {}
}