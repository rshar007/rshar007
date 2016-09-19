"use strict"

/**
* @param {number} m This represents the number of seconds
*    since the beginning of time
* @return {string} This function returns a formatted Date String
*/
function secondsToDate(m) {
    let date = new Date(0)
    date.setUTCSeconds(m)
    let dateToString = date.toUTCString().split(" ")
    let formattedDate = dateToString[2] + " " + dateToString[1]
    
    return formattedDate
}

/**
* @param {Array<Number>} dates represents the number of seconds since 1970
* @param {Array<Number>} usage represents customer usage
* @return {Array<Object>} an array of objects with day and usage combined 
*/
function combineDateAndUsage(dates, usage) {
    let dailyUsage = []
    for (let i in dates)
	dailyUsage.push({day: i + 1, usage: usage[i]})

    return dailyUsage
}

