import React from 'react';
import * as d3 from 'd3';

export default class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.drawChart = this.drawChart.bind(this)
    this.chartSelect = '#' + this.props.chartId;
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.clearChart();
    this.drawChart();
  }

  getDataMax() {
    return Math.max.apply(Math, this.props.data.map(x => x.value));
  }

  clearChart() {
    d3.select(this.chartSelect).selectAll('*').remove();
    d3.selectAll(`#${this.props.chartId}-tooltip`).remove();
  }

  drawChart() {
		let chartWidth = d3.select(this.chartSelect).node().getBoundingClientRect().width;
		let chartHeight = d3.select(this.chartSelect).node().getBoundingClientRect().height;
		let radius = Math.min(chartWidth, chartHeight) / 2;

    let tooltip = d3.select("body").append("div")
      .attr("class", "chart-tooltip")
      .attr("id", `${this.props.chartId}-tooltip`);

		let svg = d3.select(this.chartSelect)
		  .append("svg")
		  .attr("width", chartWidth)
		  .attr("height", chartHeight)
		  .append("g")
		  .attr("transform", "translate(" + chartWidth / 2 + "," + chartHeight / 2 + ")");

		let color = d3.scaleOrdinal()
		  .domain(this.props.data)
		  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

		let pie = d3.pie().value(d => d.value);
		let readyData = pie(d3.entries(this.props.data));

		svg
		  .selectAll('slices')
		  .data(readyData)
		  .enter()
		  .append('path')
		  .attr('d', d3.arc()
		    .innerRadius(0)
		    .outerRadius(radius)
		  )
		  .attr('fill', d => color(d.data.key) )
		  .attr("stroke", "white")
			.attr("class", "pie-slice")
      .on("mousemove", d =>
        tooltip
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 50 + "px")
          .style("display", "inline-block")
          .html(`<b>${d.data.key}</b> <br> ${d.value} people`)
        )
    	.on("mouseout", () => tooltip.style("display", "none"));
  }

  render() {
    // TODO: make width dynamic (responsive) later
    return (
      <div className="statistics-box">
        <h6>{this.props.name}</h6>
        <svg id={this.props.chartId} width="100%" height="120px" />
      </div>
    );
  }
}
