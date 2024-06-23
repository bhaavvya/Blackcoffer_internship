import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Preprocess data to find max intensity for each country
    const maxIntensityData = d3.rollup(
      data,
      v => d3.max(v, d => d.intensity),
      d => d.country
    );

    const processedData = Array.from(maxIntensityData, ([country, intensity]) => ({ country, intensity }));

    // Filter data to only include bars with intensity greater than 8
    const filteredData = processedData.filter(d => d.intensity > 8);

    // Set up SVG dimensions
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 40, bottom: 70, left: 60 };

    // Select the SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible')
      .style('margin-top', '50px');

    // Set up scales
    const x = d3.scaleBand()
      .domain(filteredData.map(d => d.country))
      .range([margin.left, width - margin.right])
      .padding(0.3); // Increase padding to increase the space between bars

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.intensity)]).nice()
      .range([height - margin.bottom, margin.top]);

    // Clear previous content
    svg.selectAll('*').remove();

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('font-size', '14px')
      .attr('transform', 'rotate(-45)');

    // Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Create bars
    svg.selectAll('.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.country))
      .attr('y', d => y(d.intensity))
      .attr('width', x.bandwidth()) // Adjust bar width
      .attr('height', d => y(0) - y(d.intensity))
      .attr('fill', 'steelblue');

    // Add labels above bars
    svg.selectAll('.label')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.country) + x.bandwidth() / 2)
      .attr('y', d => y(d.intensity) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.intensity);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
