import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
const { detect } = require('detect-browser');
const browser = detect();

export default class Map extends React.Component {
  constructor(props){
    super(props);

    this.legend = [
      { color: "#ef5f36", text: "Current selection" },
      { color: "#123850", text: "Recommended neighborhood" },
      { color: "#627989", text: "neighborhood" }
    ];

    this.interpolator = d3.scaleSequential()
                          .interpolator(d3.interpolateInferno)
                          .domain([0.6, 1]);
  }

  componentDidMount() {
    this.drawMap();
    this.updateMap();
  }

  componentDidUpdate() {
    this.updateMap();
  }

  isRecommended(id) {
    let rank = this.props.hoodsOfInterest.map(n => n.id).indexOf(id.toString());

    return rank < 5;
  }

  topPickSubtitle(id) {
    let rank = this.props.hoodsOfInterest.map(n => n.id).indexOf(id.toString());

    return rank !== -1 ? `<br> Ranked #${rank+1} for you` : '';
  }

  colourScale(id) {
    let hood = this.props.hoodsOfInterest.find(n => n.id === id.toString());
    return this.interpolator(hood.similarity);
  }

  drawMap() {
    let svg = d3.select('#map');
    let projection = d3.geoAlbers();
    let path = d3.geoPath().projection(projection);

		let chartWidth = d3.select('#map').node().getBoundingClientRect().width;
		let chartHeight = d3.select('#map').node().getBoundingClientRect().height;

    let tooltip = d3.select("body").append("div").attr("class", "map-tooltip");

    d3.json("../toronto_topo.json").then(toronto => {
      let featureCollection = topojson.feature(toronto, toronto.objects.toronto);

      projection
      .scale(1)
      .translate([0, 0]);

      var b = path.bounds(featureCollection),
      s = .95 / Math.max((b[1][0] - b[0][0]) / chartWidth, (b[1][1] - b[0][1]) / chartHeight),
      t = [(chartWidth - s * (b[1][0] + b[0][0])) / 2, (chartHeight - s * (b[1][1] + b[0][1])) / 2];

      projection
      .scale(s)
      .translate(t);

      svg.append("g")
        .attr('class','neighborhoods')
        .selectAll("path")
        .data(topojson.feature(toronto, toronto.objects.toronto).features)
        .enter().append("path")
        .attr("d", path)
        .attr('id', d => `neighborhood-${d.properties.id}`)
        .on("mousemove", d =>
          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 50 + "px")
            .style("display", "inline-block")
            .html(`<b>${d.properties.name}</b> ${this.topPickSubtitle(d.properties.id)}`)
          )
      	.on("mouseout", () => tooltip.style("display", "none"))
        .on("click", d => this.props.onMapClick(d.properties.id));

      this.updateMap();
    });

  }

  updateMap() {
    d3.selectAll('#legend').remove();

    d3.select('#map').selectAll('path')
      .attr('class', null)  // clear selected and recommended classes
      .attr('fill', null)  // clear detailed fill

    d3.selectAll(this.props.hoodsOfInterest.map(n => `#neighborhood-${n.id}`).join(','))
      .classed('detailed', this.props.detailed)
      .classed('recommended', !this.props.detailed)
      .attr('fill', d => this.props.detailed ? this.colourScale(d.properties.id) : null);

    d3.selectAll(`#neighborhood-${this.props.selected}`)
      .attr('class', () => this.props.detailed ? 'detailed-selected-poi': 'selected-poi');

    if(this.props.detailed) {
      this.drawDetailedLegend();
    } else {
      this.drawLegend();
    };
  }

  drawLegend() {
    let legend = d3.select('#map-legend').append('g').attr('id', 'legend')
      .selectAll('.legend').data(this.legend)
      .enter().append("g")
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(40, ${40 + i * 40})`);

    legend.append('text')
      .text(d => d.text)
      .attr('transform', 'translate(20, 14)')

    legend.append('rect')
      .attr('fill', d => d.color)
      .attr('width', 16)
      .attr('height', 16)
  }

  drawDetailedLegend() {
    let map = d3.select('#map-legend').append('g').attr('id', 'legend');

    let legend = map.append('defs')
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", this.interpolator(0.6))

    legend.append("stop")
      .attr("offset", "25%")
      .attr("stop-color", this.interpolator(0.7))

    legend.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", this.interpolator(0.8))

    legend.append("stop")
      .attr("offset", "75%")
      .attr("stop-color", this.interpolator(0.9))

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", this.interpolator(1))

    map.append("rect")
      .attr('class', '.legend')
      .attr("width", 200)
      .attr("height", 20)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(40,40)");

    map.append('text')
      .text('Less Suitable')
      .attr('transform', 'translate(40,76)')
      .attr('font-size', '12px');

    map.append('text')
      .text('More Suitable')
      .attr('transform', 'translate(160,76)')
      .attr('font-size', '12px');
  }

  render() {
    const h = browser ? (browser.name === 'safari' ? '98vh' : '100%') : '100%';
    return (
      <div className="map-svg-container">
        <svg id="map" width="100%" height={h}></svg>
        <svg id="map-legend" width="285px" height="165px"></svg>
      </div>
    );
  }
}
