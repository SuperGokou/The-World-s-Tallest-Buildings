let svg = d3.select("#bar-chart").append("svg")
    .attr("width", 500)
    .attr("height", 500)


d3.csv("data/buildings.csv", (row) => {
    // Convert numerical values from strings to numbers
    row.height_m = +row.height_m;
    row.height_px = +row.height_px;
    return row;
}).then( (data) => {

    data.sort(function(a, b) {
        return b.height_m - a.height_m;
    });

    const barWidth = 40;
    const barGap = 10;

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d, i) {
            // Position each bar horizontally (left-aligned)
            return i * (barWidth + barGap);
        })
        .attr("x", 135)
        .attr("height", barWidth)
        .attr("width", function(d) {
            // Use the 'height_px' data column to set the bar height
            return d.height_px;
        })
        .style("fill", "#4a4e69");

    svg.selectAll(".building-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "building-label")
        .attr("x", 125)
        .attr("y", function(d, i) {
            // Position labels vertically aligned with bars
            return i * (barWidth + barGap) + 20; // Adjust the vertical position
        })
        .text(function(d) {
            return d.building; // Display the building name
        });


    svg.selectAll(".height-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "height-label")
        .attr("x", function(d) {
            return 130+d.height_px;
        })
        .attr("y", function(d, i) {
            // Position labels vertically aligned with bars
            return i * (barWidth + barGap) + 20; // Adjust the vertical position
        })
        .text(function(d) {
            return d.height_m; // Display the building height
        });


    function updateBuildingDetails(buildingData) {
        const detailsDiv = d3.select("#building-details");
        detailsDiv.html("");
        // Update the image source
        const imgElement = d3.select("#image_holder");
        imgElement.attr("src", "img/" + buildingData.image);

        d3.select("#name").text(buildingData.building);
        d3.select("#height").text(buildingData.height_m + "m");
        d3.select("#city").text(buildingData.city);
        d3.select("#country").text(buildingData.country);
        d3.select("#floor").text(buildingData.floors);
        d3.select("#complete").text(buildingData.completed);

    }
    // Add click event listeners to the bars
    svg.selectAll("rect")
        .on("click", function(event, d) {
            // Call the function to update building details
            updateBuildingDetails(d);
        });

    // Add click event listeners to the building labels
    svg.selectAll(".building-label")
        .on("click", function(event, d) {
            // Call the function to update building details
            updateBuildingDetails(d);
        });

});

