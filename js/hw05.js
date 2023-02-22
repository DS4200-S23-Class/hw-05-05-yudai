console.log("linked!!!!")


// frame
const FRAME_HEIGHT = 200;
const FRAME_WIDTH = 500;
const MARGINS = {left : 30, right: 30, top: 30, buttom: 30};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.buttom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME1 = d3.select("#vis1")
				 .append("svg")
				 .attr("height", FRAME_HEIGHT)
				 .attr("width", FRAME_WIDTH)
				 .attr("class", "frame");
const FRAME2 = d3.select("#vis2")
					.append("svg")
					.attr("height", FRAME_HEIGHT)
					.attr("width", FRAME_WIDTH)
					.attr("class", "frame");

// reading data from a file
d3.csv("data/scatter-data.csv").then((data) => {
	// making sure the data is imported correctly
	// console.log(data);

	// getting max value for x and y
	const MAX_X = d3.max(data, (d) => {return parseInt(d.x)});
	const MAX_Y = d3.max(data, (d) => {return parseInt(d.y)});
	// console.log(MAX_X);
	// console.log(MAX_Y);

	const X_SCALE = d3.scaleLinear()
						.domain([0, MAX_X + 1])
						.range([0, VIS_WIDTH]);

	const Y_SCALE = d3.scaleLinear()
						.domain([0, MAX_Y + 1])
						.range([0, VIS_HEIGHT]);

	const Y_AXIS_SCALE = d3.scaleLinear()
						.domain([0, MAX_Y + 1])
						.range([VIS_HEIGHT, 0]);

	// plot
	FRAME1.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); })
		.attr("cy", (d) => { return (VIS_HEIGHT - Y_SCALE(d.y) + MARGINS.top); }) 
		.attr("r", 10) 
		.attr("class", "point");

	FRAME1.append("g")
	  .attr("transform", "translate(" + MARGINS.left + ", " + (VIS_HEIGHT + MARGINS.top) + ")")
	  .call(d3.axisBottom(X_SCALE).ticks(4))
	  .attr("font-size", "20px");

	FRAME1.append("g")
	  .attr("transform", "translate(" + MARGINS.left + ", " + (MARGINS.top) + ")")
	  .call(d3.axisLeft(Y_AXIS_SCALE).ticks(4))
	  .attr("font-size", "20px");

	const TOOLTIP = d3.select("#vis1")
						.append("div")
	  					.attr("class", "tooltip")
	  					.attr("stroke", "none");
	var counter = -1;

	// mouse clicked
	function mouseClicked(event, d) {
		// when the counter is negative, not clicked, no border
		// when the counter is positive, clicked, has a border

		if (Math.sign(counter) == -1) {
			TOOLTIP.style("stroke", "gray");
			counter *= -1
		}
		// when the counter is positive, clicked, has a border
		else {
			TOOLTIP.style("stroke", "none");
		}

	}
})


d3.csv("data/bar-data.csv").then((data) => {
	// making sure the data is imported correctly
	// console.log(data);

	const MAX_Y = d3.max(data, (d) => {return parseInt(d.amount)});
	// // console.log(Y_MAX);

	// const X_SCALE = d3.scaleBand()
	// 					.domain(data.map((d) => d.language))
	// 					.range([0, VIS_WIDTH]);

	// const Y_SCALE = d3.scaleLinear()
	// 					.domain([0, MAX_Y + 1])
	// 					.range([VIS_HEIGHT, 0]);

	// FRAME2.selectAll(".bar")
	// 	.data(data)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("class", "bar")
	// 	.attr("x", (d) => {return X_SCALE(d.category)})
	// 	.attr("y", (d) => {return Y_SCALE(d.amount)})
	// 	.attr("width", X_SCALE.bandwidth()) 
	// 	.attr("height", (d) => {return VIS_HEIGHT - Y_SCALE(d.amount);})

	// FRAME2.append("g") 
	// 	.attr("transform", "translate(" + MARGINS.left + ", " + (VIS_HEIGHT + MARGINS.top) + ")")
	// 	.call(d3.axisBottom(X_SCALE)
	// 			.scale(X_SCALE)
	// 			.tickSize(-VIS_HEIGHT, 0, 0)
	// 			.tickFormat(''))
	// 	.attr("font-size", "20px");

	// FRAME2.append("g")
	// 	.attr("transform", "translate(" + MARGINS.left + ", " + (MARGINS.top) + ")")
	// 	.call(d3.axisLeft(Y_SCALE)
	// 			.scale(Y_SCALE)
    //     		.tickSize(-VIS_WIDTH, 0, 0)
    //     		.tickFormat(''))
	// 	.attr("font-size", "15px");

	const svg = d3.select("#vis2")
					.append("svg")
					.attr("height", VIS_HEIGHT + MARGINS.top)
					.attr("width", VIS_WIDTH + MARGINS.left)
					.attr("viewBox", [0, 0, FRAME_WIDTH, FRAME_HEIGHT]);

	const x = d3.scaleBand()
				.domain(d3.range(data.length))
				.range([MARGINS.left, VIS_WIDTH + MARGINS.left])
				.padding(0.1);

	const y = d3.scaleLinear()
				.domain([0, MAX_Y])
				.range([VIS_HEIGHT + MARGINS.top, MARGINS.top]);

	svg.append("g")
		.attr('fill', "royalblue")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("x", (d, i) => x(i))
			.attr("y", (d) => y(d.amount))
			.attr("height", (d) => y(d.amount))
			.attr("width", x.bandwidth())

	function xAxis(g) {
		g.attr("transform", "translate(${VIS_HEIGHT + MARGINS.top})")
			.call (d3.axisBottom(x).tickFormat(i => data[i].category))
			.attr('font-size', '20px')
	}

	function yAxis(g) {
		g.attr("transform", "translate(${MARGINS.left}, 0)")
			.call (d3.axisLeft(y).ticks(null, data.format))
			.attr('font-size', '20px')
	}

	svg.append('g').call(yAxis);
	svg.append('g').call(xAxis);
	svg.node(); 
})