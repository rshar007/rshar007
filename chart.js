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

/**
* @param {number} watts represents the number of watts used
* @return {string} dollarAmount which is the estimated dollar value of energy
*    consumption
*/
function estimateDollars(watts) {
    let pricePerWatt = 0.21 * .001

    return "$" + String((watts * pricePerWatt).toFixed(2))
}

d3.json("data.json", (error, data) => {
    // throw an error if data could not be loaded
    if (error) throw error

    let usage = data.day_stats
    let dates = Object.keys(usage)
	.map(key => Number(key))
    let dailyUsage = Object.values(usage)
    let dayAndUsage = combineDateAndUsage(dates, dailyUsage)

    console.log(dayAndUsage)
    let svg = d3.select("svg"),
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = +svg.attr("width") - margin.left - margin.right,
	height = +svg.attr("height") - margin.top - margin.bottom
    
    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0])

    let g = svg.append("g")
	.attr("transform", "translate(" +
	      margin.left + "," + margin.top + ")")
    x.domain(dayAndUsage.map(d => d.day))
    y.domain([0, d3.max(dayAndUsage, d => d.usage)])

    g.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))
    
    g.append("g")
    	.attr("class", "axis axis--y")
    	.call(d3.axisLeft(y).ticks(10))
    	.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", 6)
    	.attr("dy", "0.71em")
    	.attr("text-anchor", "end")
    	.text("Usage")

    g.selectAll(".bar")
    	.data(dayAndUsage)
    	.enter().append("rect")
    	.attr("class", "bar")
    	.attr("x", d => x(d.day))
	.attr("y", d => y(d.usage))
	.attr("width", x.bandwidth())
	.attr("height", d => height - y(d.usage))

    let useSubtitle = d3.select("h2.useSubtitle")
    useSubtitle.html(String(data.relevant_timespan.month_long + " usage data"))
    
    let monthUse = d3.select("div.monthUse")
    monthUse.html("You used " + String(data.monthly_usage) +
		  " watts this month, which is about " +
		  estimateDollars(data.monthly_usage))

    let weekdayAverage = d3.select("div.weekdayAverage")
    weekdayAverage.html("Your weekday average was " +
			String(data.weekday_average) +
			" watts, which is about " +
			estimateDollars(data.weekday_average) + " per day")

    let averageDay = d3.select("div.averageDay")
    averageDay.html("On average, you used "+
		    String(data.average_day) +
		    " watts per day, which is about " +
		    estimateDollars(data.average_day) + " per day" )
})
