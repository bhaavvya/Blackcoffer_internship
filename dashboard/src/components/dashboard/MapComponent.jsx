import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import regionCoordinates from './regionCoordinates';

const MapComponent = ({ regions }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    const projection = d3.geoMercator()
      .center([0, 0])
      .scale(150)
      .translate([width / 2, height / 2]);

    svg.attr('width', width).attr('height', height);

    const colorScale = d3.scaleLinear()
      .domain([0, 1]) // Adjust domain based on your intensity range (0 to 1 in this example)
      .range(['green', 'red']); // Adjust colors based on your preference

    // Load world map GeoJSON data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((geojson) => {
      // Draw map paths
      svg.selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection))
        .attr('fill', (d) => {
          const regionName = d.properties.name;
          const intensity = regionCoordinates[regionName]?.intensity; // Assuming intensity data is available

          if (intensity !== undefined) {
            return colorScale(intensity);
          } else {
            return 'lightgrey'; // Default color for regions without intensity data
          }
        })
        .attr('stroke', 'black');

      // Draw points for regions
      svg.selectAll('circle')
        .data(regions)
        .enter()
        .append('circle')
        .attr('cx', d => projection([regionCoordinates[d].coordinates[0], regionCoordinates[d].coordinates[1]])[0])
        .attr('cy', d => projection([regionCoordinates[d].coordinates[0], regionCoordinates[d].coordinates[1]])[1])
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('opacity', 0.7);

      // Add region names
      svg.selectAll('text')
        .data(regions)
        .enter()
        .append('text')
        .attr('x', d => projection([regionCoordinates[d].coordinates[0], regionCoordinates[d].coordinates[1]])[0] + 10) // Adjust offset as needed
        .attr('y', d => projection([regionCoordinates[d].coordinates[0], regionCoordinates[d].coordinates[1]])[1] + 5)  // Adjust offset as needed
        .text(d => d)
        .attr('font-size', '15px')
        .attr('fill', 'black');
    });

  }, [regions]);

  return <svg ref={svgRef}></svg>;
};

export default MapComponent;
