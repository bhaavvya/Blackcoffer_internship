import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const IntensityChart = ({ data, startYear, endYear }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter data based on the selected range
    const filteredData = data.filter(d => d.start_year >= startYear && d.start_year <= endYear);

    // Prepare data: Group by start_year and find max intensity for each group
    const dataByYear = d3.rollup(
      filteredData,
      v => d3.max(v, d => d.intensity),
      d => d.start_year
    );

    let processedData = Array.from(dataByYear, ([year, intensity]) => ({ year, intensity }));

    // Sort processed data by start_year
    processedData = processedData.sort((a, b) => a.year - b.year);

    // Clear previous SVG content before rendering new chart
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 50, right: 50, bottom: 100, left: 150 }; // Increased bottom margin for intensity value
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
      .domain(processedData.map(d => d.year)) // Use unique start_year values
      .range([0, width])
      .padding(0.5); // Adjust padding between bars if needed

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.intensity)])
      .nice()
      .range([height, 0]);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.9em')
      .attr('dy', '.15em')
      .style('font-size', '14px')
      .attr('transform', 'rotate(-45)');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll('.bar')
      .data(processedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year)) // Position bars based on start_year
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.intensity))
      .attr('height', d => height - y(d.intensity))
      .style('fill', '#69b3a2');

    // Value labels above the bars with max intensity for each start_year
    svg.selectAll('.bar-label')
      .data(processedData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => x(d.year) + x.bandwidth() / 2)
      .attr('y', d => y(d.intensity) - 10) // Offset above the bar
      .attr('text-anchor', 'middle')
      .style('font-size', '14px') // Increase font size for better visibility
      .text(d => d.intensity);

  }, [data, startYear, endYear]);

  return (
    <div style={{ margin: '50px', padding: '10px', fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '100%', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Intensity Bar Chart</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityChart;
