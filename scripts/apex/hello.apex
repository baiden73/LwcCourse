// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);

Id acctId = [SELECT Id FROM Account WHERE Name LIKE 'Edg%' LIMIT 1].Id;
system.debug(acctId);
system.debug(OpportunityController.getOpportunities(acctId));

system.debug(AcctController.getTopAccounts());