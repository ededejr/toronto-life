import React, { Component } from 'react';
import NeighborhoodCard from '../../components/neighborhood-card';
import DataSvc from '../../services/data-service';
import LivabilitySvc from '../../services/livability-service';
import './styles.scss';

export default class NeighborhoodResults extends Component {

    constructor(props) {
        super(props);
        const { values, diversity } = props.location.state;
        const { neighborhoods, couldFilterByDiversity } = LivabilitySvc.calculateLivability(values, diversity,0);


        this.state = {
            neighborhoods: neighborhoods.map(n => {
                const neighborhood = DataSvc.getNeighborhoodById(n.id);
                return {
                    rank: neighborhoods.indexOf(n)+1,
                    ...n,
                    ...neighborhood
                }
            }),
            couldFilterByDiversity,
            livabilityResults: {
                neighborhoods: null,
                couldFilterByDiversity
            }
        };

        this.state.livabilityResults.neighborhoods = this.state.neighborhoods.slice(0,5);

        this.goToDetails = this.goToDetails.bind(this);
    }

    goToDetails(n) {
        const { history } = this.props;
        history.push('/results/details', {
            defaultSelection: n,
            livabilityResults: this.state.livabilityResults,
            neighborhoods: this.state.neighborhoods,
        });
    }

    render() {
        const { livabilityResults, couldFilterByDiversity } = this.state;
        const listOfBestNeighborhoods = livabilityResults.neighborhoods;

        const headerTitle = couldFilterByDiversity ? 'Congratulations!' : 'Uh oh!';
        const headerSubtitle = couldFilterByDiversity ? 'These might be just what you\'re looking for' : 'We couldn\'t find your an exact match, but here are some highly similar options';

        return (
            <div className="results-list-box">
                <div className="results-list-header">
                    <div className="results-list-header-title">{headerTitle}</div>
                    <div className="results-list-header-subtitle">{headerSubtitle}</div>
                </div>
                <div className="results-list-content">
                    {listOfBestNeighborhoods.map(n => <NeighborhoodCard neighborhood={n} action={this.goToDetails} key={n.id}/>)}
                </div>
            </div>
        )
    }
}
