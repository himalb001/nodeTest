/**
 * Web services
 * 
 * Web services is a wrapper around https module.
 * It provides generic GET and POST functionality 
 * with the added option of specifying numberOfTries 
 * and interval between tries
 * 
 */

const https = require("https");
const querystring = require("querystring");

/**
 * Generic function get API endpoint with built in retry functionality
 * 
 * @param {string} endpoint API endpoint
 * @param {number} triesLeft number of tries before failing / avoid stackoverflow
 * @param {number} interval ms interval between retries
 */
async function getAPIEndpoint(endpoint, tries, interval) {
    // Base case
    if (tries < 1) new Promise.reject("Cannot connect to API endpoint");

    
    try {
        const returnPromise = await new Promise((resolve, reject) => {


            https.get(endpoint, (resp) => {
                let data = '';

                if (resp.statusCode != 200) {
                    reject("Invalid response from server");
                }

                // Add to data
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // Resolve when complete
                resp.on('end', () => {
                    resolve(JSON.parse(data))
                });

                // On error
                resp.on("error",(err)=>{
                    reject("Connection error");
                })
            })
        });

        return returnPromise;

    } catch (error) {

        // Note - try/catch and promises doesn't work well inside async func
        // like settimeout. Workaround to use await sleep
        await sleep(interval);

        console.log("Cannot connect using GET - " + (tries - 1) + " tries left. Error: " + error);
        
        // Recursive function
        return this.getAPIEndpoint(endpoint, tries - 1, interval)
    }

}




/**
 * Generic function get API endpoint with built in retry functionality
 * 
 * @param {string} endpoint API endpoint
 * @param {number} triesLeft number of tries before failing / avoid stackoverflow
 * @param {number} interval ms interval between retries
 */
async function postAPIEndpoint(baseURL, endpoint, body, tries, interval) {
    
    if (tries < 1) new Promise.reject("Cannot connect to API endpoint"); // base case

    try {
        const returnPromise = await new Promise((resolve, reject) => {
            
            var postOptions = {
                host: baseURL,
                path: endpoint,
                method: "POST",
                headers: {
                    'Content-Type': "application/json" // hardcoded to json for this project
                }
            }

            const request = https.request(postOptions, (resp) => {
                let data = '';
                
                if (resp.statusCode != 200) {
                    reject("Invalid response from server");
                }

                // Add to data
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // Resolve when complete
                resp.on('end', () => {
                    resolve(JSON.parse(data))
                });

                // On error
                resp.on("error", (err) => {
                    reject("Connection error");
                })

            })
            
            // request body content
            request.write(JSON.stringify(body));
            request.end();
        });

        return returnPromise;

    } catch (error) {
        
        // Note - try/catch and promises doesn't work well inside async func
        // like settimeout. Workaround to use await 
        await sleep(interval);

        // Wait for interval and recursively try again
        console.log("Cannot connect using POST - " + baseURL + "and" + endpoint + (tries - 1) + " tries left. Error: " + error);
        return this.postAPIEndpoint(baseURL, endpoint, body, tries - 1, interval);

    }

}


async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


module.exports.getAPIEndpoint = getAPIEndpoint;
module.exports.postAPIEndpoint = postAPIEndpoint;