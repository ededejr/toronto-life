import React from 'react'
import './styles.scss';
import MapContainer from '../../components/MapContainer';

class LivabilityResult extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.location.state
    };

    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    this.props.history.push('/');
  }

  render() {
    const { defaultSelection, livabilityResults, neighborhoods } = this.state;

    return (
      <div className="App">
        <MapContainer defaultSelection={defaultSelection} livabilityResults={livabilityResults} neighborhoods={neighborhoods} goHome={this.goHome} />
      </div>
    );
  }
}

export default LivabilityResult;
