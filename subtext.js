
const webService = require('./web.service');
const constants = require("./constants");


// API call handler
const handler = (request,response)=>{

    try {

        // 2 Get requests
        const textToSearchPromise = getFromEndpoint(constants.textToSearch);
        const subtextsPromise = getFromEndpoint(constants.subtexts);


        Promise.all([textToSearchPromise, subtextsPromise]).then(values => {
            // Extract text
            const text = getTextToSearchFromJSON(values[0]);
            
            // Extract subtext array
            const subtexts = getSubtextArrayFromJSON(values[1]);

            // Calculate Results
            const results = getIndicesForString(subtexts, text);
            
            // Generate JSON 
            const outputJSON = generateJSONOutput(constants.candidateName, text, results);

            // Post to APO
            postToAPIEndpoint(constants.postURL, outputJSON).then((postResponse)=>{
                response.json(postResponse);
            })
        }); 
    } catch (error) {
        
        // only major errors should be caught here -  
        response.send("Error " + error);
    }

}


/**
 * Given searchString and subtexts array, the function will
 * return array with subtexts and indexes for each subtexts.
 * 
 * @param {string[]} subtexts Array of subtexts
 * @param {string} searchString String to search
 * 
 * @returns Formatted result array
 */
const getIndicesForString = (subtexts, searchString)=>{    
    
    if(subtexts.length <= 0 || searchString.length <= 0){return []};

    let searchStringLower = searchString.toLowerCase();
    
    // Store calculated subtexts result in a map for caching
    let cacheMap = new Map();

    let responseArray = []; // response array is blank to begin
    

    for (const subtext of subtexts) {
        
        let subtextLower = subtext.toLowerCase();

        // Skip loop if there's matching cache already
        if (cacheMap.has(subtextLower)) {
            const matchingIndexes = cacheMap.get(subtextLower);
            const keyVal = createDynamicKeyValObject(subtext, matchingIndexes)
            responseArray.push(keyVal);
            continue; // onto next iteration
        }



        // Holds all matching indexes for current subtext
        let indexArray = []

        for (let idx = 0; idx < searchStringLower.length; idx++) {
            
            const currentChar = searchStringLower[idx];

            // If the current char matches the first character of substring
            if (currentChar == subtext[0].toLowerCase() ) {
                
                var isSubstringAtIndex = substringMatchAtIndex(searchStringLower, subtextLower, idx);

                if(isSubstringAtIndex){
                    indexArray.push(idx + 1);
                }

            }
        }

        // Add to cacheMap
        cacheMap.set(subtext.toLowerCase(), indexArray); 
        
        // Add original text for response array
        const keyVal = createDynamicKeyValObject(subtext, indexArray);
        responseArray.push(keyVal);
    }
    
    // Response
    return responseArray;
}


/**
 * Given the input, the function will generate a predefined JSON
 * response
 * 
 * @param {string} candidateName Candidate name
 * @param {string} text Text string
 * @param {object[]} results - Formatted result array
 */
const generateJSONOutput = (candidateName, text, results)=>{
    response = {
        candidate: candidateName,
        text: text,
        results: results
    }
    return response;
}


/**
 * Given relativepath and body, post it to the given endpoint
 * 
 * @param {string} relativePath Relative path for POST
 * @param {object} body Body for post 
 * 
 * @returns {Promise{JSON}} JSON response wrapped in a promise
 */
const postToAPIEndpoint = (relativePath, body)=>{
    return webService.postAPIEndpoint(constants.baseURL, relativePath, body, 10, 1000);
}



/**
 * Given relativepath and body, get the content from JSON
 *
 * @param {string} relativePath Relative path for GET request
 *
 * @returns {Promise{JSON}} JSON response wrapped in a promise
 */
const getFromEndpoint = (relativePath) => {
    return webService.getAPIEndpoint(constants.urlProtocol + constants.baseURL + relativePath, 10, 1000);
}



/**
 * 
 * Generate a single result value from substring array of indices
 * 
 * @param {string} key Substring string
 * @param {string} val array of index 
 */
const createDynamicKeyValObject = (key, val)=>{
    
    key = key || "";

    const keyVal = {}
    keyVal["subtext"] = key;

    // <No output> when no indices are found
    if(val && val.length > 0){
        keyVal["result"] = val.join(", ");
    }else{
        keyVal["result"] = "<No Output>"
    }

    return keyVal;
}


/**
 * 
 * Given searchString + start index and subtext
 * the function returns whether subtext matches searchstring
 * 
 * @param {string} searchString string to match
 * @param {string} subtext subtext to match
 * @param {int} startIndex Start index of searchIndex
 * 
 * @returns {Boolean} true if matches, false if not
 */
const substringMatchAtIndex = (searchString, subtext, startIndex)=>{
    
    // if searchString ends before subtext ends, it's not a match
    if(searchString.length < (startIndex + subtext.length) || startIndex < 0){return false};

    // Check forward 
    for (let idx = 0; idx < subtext.length; idx++) {
        if(searchString[startIndex + idx] != subtext[idx]) return false;
    }
    
    return true

}


/**
 * 
 * Parse json and return text from predefined json object
 * 
 * @param {JSON} json json object
 * 
 * @returns {string} Text
 */
const getTextToSearchFromJSON = (json) => {
    if(!json) throw new Error("InvalidJsonError - JSON is empty");

    if(json.text){
        return json.text;
    }else{
        throw new Error("InvalidJsonError - JSON structure mismatch");
    }
}


/**
 * 
 * @param {JSON} jsontwister
 */
const getSubtextArrayFromJSON = (json) => {
    if (!json) throw new Error("InvalidJsonError - JSON is empty");

    if (json.subTexts) {
        return json.subTexts;
    } else {

        throw new Error("InvalidJsonError - JSON structure mismatch");
    }
}



/**
 * Expose all functions
 */
module.exports.handler = handler;
module.exports.getIndicesForString = getIndicesForString
module.exports.generateJSONOutput = generateJSONOutput
module.exports.postToAPIEndpoint = postToAPIEndpoint
module.exports.getFromEndpoint = getFromEndpoint
module.exports.createDynamicKeyValObject = createDynamicKeyValObject
module.exports.substringMatchAtIndex = substringMatchAtIndex
module.exports.getTextToSearchFromJSON = getTextToSearchFromJSON
module.exports.getSubtextArrayFromJSON = getSubtextArrayFromJSON