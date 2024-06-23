import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Pie function with percentage calculation
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);

    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .selectAll("tspan")
      .data(d => [d.data.category, `${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%`])
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("dy", (d, i) => i === 0 ? "-0.6em" : "1.2em")
      .text(d => d);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
