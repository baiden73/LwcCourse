public with sharing class CreditCheckContinuation {
    
    // create an action method to populate a continuation object with callouts
    @AuraEnabled(continuation=true cacheable=true)
    public static Object creditCheckApi(String accountId) {

        // create a continuation object
        Continuation con = new Continuation(60);
        con.continuationMethod = 'processResponse';
        con.state = 'Howdy';

        // query the database to retrieve information about the account for the parameters
        Account a = [SELECT Id, Name, Owner.Name, Owner.Email FROM Account
            WHERE Id = :accountId LIMIT 1];

        // create a string variable to hold the url and parameters for the endpoint
        String url = 'https://steve-wasula-splx201-dev-ed.my.salesforce-sites.com/creditcheck';

        // append the parameters for the callout
        url += '?name=' + EncodingUtil.urlEncode(a.Name, 'UTF-8')
            + '&email=' + a.Owner.Email
            + '&requestor=' + EncodingUtil.urlEncode(a.Owner.Name, 'UTF-8');

        system.debug(url);

        // create an instance of the HTTP class for sending ou request
        //Http h = new Http();

        // create a new HTTP Request and set the method and endpoint
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        // add the HTTP Request to my continuation object
        con.addHttpRequest(req);

        // add up to two more requests (total of 3) to this object

        // return the continuation object
        return con;

        // create a new HTTP Response to hold he response that is returned from the request
        //HttpResponse response = h.send(req);

        //system.debug(response.getStatusCode());
        //system.debug(response.getBody());

    }

    // create a callback method that executes when the callouts are complete
    @AuraEnabled(cacheable=true)
    public static Object processResponse(List<String> labels, Object state) {
        // access the response from the List and return the body to our LWC
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}