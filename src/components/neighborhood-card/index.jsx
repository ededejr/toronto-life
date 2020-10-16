import React, { Component } from 'react';
import './styles.scss';

export default class NeighborhoodCard extends Component {

  constructor(props) {
    super(props);
    const { neighborhood, action } = this.props;

    this.state = {
      neighborhood,
      click: () => action(neighborhood),
    }
  }

  render() {
    const { name, rank, prettyDescriptor } = this.state.neighborhood;
    const { click } = this.state;

    return (
      <div className="neighborhood-card" onClick={click}>
        <div className="neighborhood-card-header"
        style={{backgroundImage: `url(${prettyDescriptor.src})`}}></div>
        <div className="neighborhood-card-content">
          <div className="neighborhood-card-rank">
            {rank}
          </div>
          <div className="neighborhood-card-title">
            {name}
          </div>
        </div>
      </div>
    )
  }
}
