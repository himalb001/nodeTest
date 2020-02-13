const webService = require('./web.service');
const constants = require("./constants");


// API call handler
const handler = (req, res) => {

    try {

        // Get 2 web request
        const rangePromise = getFromEndpoint(constants.rangeInfoPath);
        const divisorPromise = getFromEndpoint(constants.divisorInfo);

        // Wait for both before continuing
        Promise.all([rangePromise, divisorPromise]).then((values) => {

            // Get MinMax values
            minMax = getMinMaxRange(values[0]);

            // Get divisor values
            divisorMap = getDivisorMap(values[1])

            // Generate lines
            const lines = getLinesFromBoundAndDivisor(minMax, divisorMap);
            res.end(lines);

        });

    } catch (error) {
        
        // only major errors should be caught here - 
        res.send("Error: " + error);
    }

}

/**
 * 
 * Given the relativepath, the function returns response
 * wrapped in a promise
 * 
 * @param {string} relativePath - Relative path to the API endpoint
 * @returns {Promise} Promise with response
 */
const getFromEndpoint = (relativePath) => {
    return webService.getAPIEndpoint(constants.urlProtocol + constants.baseURL + relativePath, 10, 1000);
}



/**
 * Get lower and upper bound from the json and return an
 * array with [lower,upper] values.
 * 
 * @param {JSON} jsonResponse JSON of specific format {lower:int, higher:int}
 */
const getMinMaxRange = (jsonResponse) => {
    // Sanity check
    if (!jsonResponse) throw new Error("InvalidJsonError - Json is empty");

    // Store minMax as an array
    let minMax = [];

    // Int check
    let lower = parseInt(jsonResponse.lower);
    let higher = parseInt(jsonResponse.upper);


    if (isNaN(lower) || isNaN(higher)) {
        throw new Error("InvalidJsonError - Invalid lower & upper bounds " + JSON.stringify(jsonResponse));
    } else {
        // To further normalize data - min cann't be less than 0
        // and max can't be below 0
        lower = Math.max(lower, 0);
        higher = Math.max(higher, 0);

        minMax.push(Math.min(lower,higher)); // min can start from 0;
        minMax.push(Math.max(lower,higher)); // max has to be higher than 0

        return minMax;
    }

}


/**
 * Get a map object of divisor JSON
 * 
 * @param {JSON} jsonResponse JSON array of specific format [{divisor:int, output:string}]
 * @returns {Map<divisor,output>} Map object of divisor and output
 */
const getDivisorMap = (jsonResponse) => {

    // If json is empty, assume no divisor
    if (!jsonResponse || 
        !jsonResponse.outputDetails ||
         jsonResponse.outputDetails.length <= 0) {
             return new Map();
        }

    const divisorArray = jsonResponse.outputDetails;

    // Reduce array to single map
    return divisorArray.reduce((map, currentValue, idx) => {
        return map.set(currentValue.divisor, currentValue.output)
    }, new Map());

}


/**
 * Given the minMax numbers and divisorMap
 * Generate a string with newline character 
 * with correct divisor output on each line
 * 
 * @param {[int,int]} minMax Array of min,max pair
 * @param {Map<int,string>} divisorMap Map of divisor object
 */
const getLinesFromBoundAndDivisor = (minMax, divisorMap) => {

    let paragraph = "";

    // Iterate through each number from min->max
    for (let idx = minMax[0]; idx <= minMax[1]; idx++) {

        // new line starts with number:
        let currentLine = "";
        currentLine += idx + ": ";

        // For each divisor that matches, append it to current line
        for (const [key, value] of divisorMap) {
            if (idx % key == 0) {
                currentLine += value;
            }
        }

        paragraph += currentLine + "\r";
    }

    return paragraph
}



module.exports.handler = handler
module.exports.getFromEndpoint = getFromEndpoint
module.exports.getMinMaxRange = getMinMaxRange
module.exports.getDivisorMap = getDivisorMap
module.exports.getLinesFromBoundAndDivisor = getLinesFromBoundAndDivisor