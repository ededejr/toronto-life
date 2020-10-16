import React from 'react';
import * as d3 from 'd3';

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.drawChart = this.drawChart.bind(this);
    this.chartSelect = '#' + this.props.chartId;
    this.setEntries();
  }

  setEntries() {
    this.entries = d3.entries(this.props.data);
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.clearChart();
    this.setEntries();
    this.drawChart();
  }

  getDataMax() {
    return Math.max.apply(Math, this.entries.map(x => x.value));
  }

  clearChart() {
    d3.select(this.chartSelect).selectAll('*').remove();
    d3.selectAll(`#${this.props.chartId}-tooltip`).remove();
  }

  drawChart() {
    const dataMax = this.getDataMax();

    let chartWidth = d3.select(this.chartSelect).node().getBoundingClientRect().width;
		let chartHeight = d3.select(this.chartSelect).node().getBoundingClientRect().height;
    let barWidth = chartWidth / this.entries.length;

    let tooltip = d3.select("body").append("div")
      .attr("class", "chart-tooltip")
      .attr("id", `${this.props.chartId}-tooltip`);

    this.bars = d3.select(this.chartSelect).selectAll('g').data(this.entries);
    this.bars.exit().remove();

    this.bars
      .enter().append('g')
      .attr('transform', (d, i) => `translate(${i * barWidth},${chartHeight - d.value / dataMax * chartHeight })`)
      .append('rect')
      .attr('class', 'bar')
      .attr('width', barWidth)
      .attr('height', d => d.value / dataMax * chartHeight)
      .on("mousemove", d =>
        tooltip
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 50 + "px")
          .style("display", "inline-block")
          .html(`<b>${d.key}</b> <br> ${d.value} people`)
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
