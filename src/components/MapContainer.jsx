import React from 'react';
import Map from './Map';
import Sidebar from './Sidebar';
import PreferenceForm from './PreferenceForm';
import { Row, Col, Navbar, DropdownButton, Dropdown, Toast } from 'react-bootstrap';
import DataSvc from '../services/data-service';
import LivabilitySvc from '../services/livability-service';

export default class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.setCurrentHood = this.setCurrentHood.bind(this);
    this.getNewNeighborhoods = this.getNewNeighborhoods.bind(this);
    this.closeToast = this.closeToast.bind(this);

    const {defaultSelection, livabilityResults, neighborhoods} = this.props;
    this.numRecommended = 5;

    this.state = {
      currentHood: defaultSelection,
      neighborhoods,
      bestNeighborhoods: livabilityResults.neighborhoods,
      showToast: true,
      detailed: false
    };

    this.setCurrentHood = this.setCurrentHood.bind(this);
  }

  setCurrentHood(newNeighborhoodId) {
    let n = this.state.neighborhoods.find(({id}) => +id === newNeighborhoodId) || DataSvc.getNeighborhoodById(newNeighborhoodId);
    n = n.id ? n : {
      ...n, 
      id: n.neighborhoodID,
      rank: 'Not Ranked'
    };

    this.setState ({
      currentHood: n
    });
  }

  getNewNeighborhoods(preferences, diversity, isDetailed) {
    let livability = LivabilitySvc.calculateLivability(preferences, diversity, 0);
    this.setCurrentHood(livability.neighborhoods[0].id);
    this.setState({
      bestNeighborhoods: livability.neighborhoods.slice(0, (isDetailed ? 140 : this.numRecommended)),
      neighborhoods: livability.neighborhoods.map(n => {
        const neighborhood = DataSvc.getNeighborhoodById(n.id);
        return {
            rank: livability.neighborhoods.indexOf(n)+1,
            ...n,
            ...neighborhood
        }
    }),
      showToast: true,
      detailed: isDetailed
    });
  }

  getSelectedId() {
    return this.state.currentHood.neighborhoodID;
  }

  bestNeighborhoodsIds() {
    return this.state.bestNeighborhoods.map(n => n.id);
  }

  closeToast() {
    this.setState({ showToast:false });
  }

  renderToast() {
    return (
      <div className="toast-container">
        <Toast show={this.state.showToast} onClose={this.closeToast}>
          <Toast.Header>
            <strong>
              We've found {Math.min(this.state.bestNeighborhoods.length, this.numRecommended)} neighborhoods for you!
            </strong>
          </Toast.Header>
          <Toast.Body>
            <span style={{fontWeight: 'bold'}}>{this.state.bestNeighborhoods[0].name}</span> is the top pick.
          </Toast.Body>
        </Toast>
      </div>
    );
  }

  renderNavBar() {
    return (
      <Navbar variant="dark">
        <Navbar.Brand style={{cursor: 'pointer'}} onClick={this.props.goHome}>TorontoLife</Navbar.Brand>
      </Navbar>
    );
  }

  renderStats() {
    const { currentHood } = this.state;
    return (
      <div className="statistics-content">
        <h4>Statistics for:</h4>
        <DropdownButton variant="outline-dark" id="dropdown-basic-button" title={currentHood.name}>
          {this.state.bestNeighborhoods.slice(0,this.numRecommended).map((hood, i) =>
            <Dropdown.Item key={i} eventKey={hood.id} onSelect={this.setCurrentHood}>{i+1 + ' - ' + hood.name}</Dropdown.Item>
          )}
        </DropdownButton>
        <Sidebar data={currentHood} />
      </div>
    );
  }

  render() {
    const toast = this.renderToast();
    const navBar = this.renderNavBar();
    const stats = this.renderStats();

    return (
      <>
        { toast }
        <Row noGutters>
          <Col sm={6} md={9} className='map-side'>
            { navBar }
            <Map onMapClick={this.setCurrentHood}
                 hoodsOfInterest={this.state.bestNeighborhoods}
                 detailed={this.state.detailed}
                 selected={this.getSelectedId()} />
          </Col>
          <Col sm={6} md={3} className="sidebar">
            <PreferenceForm onSetPreferences={this.getNewNeighborhoods} diversityOptions={this.diversityOptions} />
            { stats }
          </Col>
        </Row>
      </>
    );
  }
}
