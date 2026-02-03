// Chart configuration
const CONFIG = {
    barWidth: 36,
    barGap: 12,
    labelOffset: 130,
    barStartX: 140,
    chartWidth: 520,
    chartHeight: 480,
    colors: [
        '#ef8354', '#4f5d75', '#2d3142', '#667eea', '#764ba2',
        '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b'
    ]
};

// Create SVG element
const svg = d3.select('#bar-chart')
    .attr('width', CONFIG.chartWidth)
    .attr('height', CONFIG.chartHeight);

// Track selected building
let selectedIndex = 0;

// Load and render data
d3.csv('data/buildings.csv', row => ({
    building: row.building,
    country: row.country,
    city: row.city,
    height_m: +row.height_m,
    height_px: +row.height_px,
    floors: +row.floors,
    completed: +row.completed,
    image: row.image,
    wiki: row.wiki
}))
.then(data => {
    // Sort by height descending
    data.sort((a, b) => b.height_m - a.height_m);

    // Create bars with gradient colors
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', CONFIG.barStartX)
        .attr('y', (d, i) => i * (CONFIG.barWidth + CONFIG.barGap))
        .attr('width', 0)
        .attr('height', CONFIG.barWidth)
        .attr('rx', 4)
        .style('fill', (d, i) => CONFIG.colors[i % CONFIG.colors.length])
        .on('click', (event, d) => {
            selectedIndex = data.indexOf(d);
            updateDetails(d);
            updateSelection();
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 80)
        .attr('width', d => d.height_px);

    // Create building name labels
    svg.selectAll('.building-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'building-label')
        .attr('x', CONFIG.labelOffset)
        .attr('y', (d, i) => i * (CONFIG.barWidth + CONFIG.barGap) + CONFIG.barWidth / 2 + 4)
        .text(d => d.building)
        .style('opacity', 0)
        .on('click', (event, d) => {
            selectedIndex = data.indexOf(d);
            updateDetails(d);
            updateSelection();
        })
        .transition()
        .duration(500)
        .delay((d, i) => i * 80 + 400)
        .style('opacity', 1);

    // Create height labels on bars
    svg.selectAll('.height-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'height-label')
        .attr('x', d => CONFIG.barStartX + d.height_px - 8)
        .attr('y', (d, i) => i * (CONFIG.barWidth + CONFIG.barGap) + CONFIG.barWidth / 2 + 4)
        .text(d => d.height_m + 'm')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay((d, i) => i * 80 + 600)
        .style('opacity', 1);

    // Update selection styling
    function updateSelection() {
        svg.selectAll('.building-label')
            .classed('active', (d, i) => i === selectedIndex);

        svg.selectAll('rect')
            .transition()
            .duration(200)
            .style('opacity', (d, i) => i === selectedIndex ? 1 : 0.7);
    }

    // Set initial selection
    updateDetails(data[0]);
    setTimeout(updateSelection, 1000);
})
.catch(error => {
    console.error('Error loading building data:', error);
    document.querySelector('.chart-section').innerHTML =
        '<p style="color: #e74c3c; padding: 20px; text-align: center;">Failed to load data. Please run from a web server.</p>';
});

// Update the details panel with selected building info
function updateDetails(building) {
    const img = document.getElementById('image-holder');
    img.style.opacity = '0';

    setTimeout(() => {
        img.src = 'img/' + building.image;
        img.onload = () => {
            img.style.opacity = '1';
        };
    }, 150);

    document.getElementById('name').textContent = building.building;
    document.getElementById('height').textContent = building.height_m + 'm';
    document.getElementById('city').textContent = building.city;
    document.getElementById('country').textContent = building.country;
    document.getElementById('floors').textContent = building.floors;
    document.getElementById('completed').textContent = building.completed;
    document.getElementById('wiki-link').href = building.wiki;
}
