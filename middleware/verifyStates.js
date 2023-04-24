

/* 
1) You will need to pull in the state codes from the statesData.json file.
2) Instead of all of the states data, just make a states code array - I recommend using the array map() method to do this.
3) Search your newly created states code array to see if the state parameter received is in there.
4) If it isn't, return the appropriate response
5) If it is, attach the verified code to the request object: req.code = stateCode and call next() to move on.

You should see examples of the request object as referenced above and calling next() in middleware from the assigned middleware tutorial video.

P.S. -  Notice all of the state codes in the statesData.json file are capitalized. You want to be able to receive lowercase and mixed-case parameters. 
        I suggest using the .toUpperCase() string method when receiving the parameter value. 
*/