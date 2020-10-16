import React from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import TextStatistics from './TextStatistics';
import DataSvc from '../services/data-service';

export default class Sidebar extends React.Component {
  
  render() {
    const textStatistics = {
      mostPopularLanguage: DataSvc.getMostSpokenLanguage(this.props.data.id),
      highestEducationLevels: DataSvc.getMostPopularEducationLevel(this.props.data.id),
      mostPopularEthnicity: DataSvc.getMostPopularEthnicity(this.props.data.id),
      mostCommonEmployment: DataSvc.getMostCommonEmployment(this.props.data.id)
    }

    const rank = this.props.data.rank ? (<TextStatistics 
      name="Rank"
      statistic={this.props.data.rank}
    />) : null;

    return (
      <div className="statistics-cards">
        {rank}
        <TextStatistics 
          name="Population"
          statistic={this.props.data.population['Population, 2016']}/>
        <TextStatistics 
          name="Most Popular Language"
          statistic={textStatistics.mostPopularLanguage.attr}
          description={`Spoken by ${textStatistics.mostPopularLanguage.value} people`}/>
        <TextStatistics 
          name="Most Common Ethnicity"
          statistic={textStatistics.mostPopularEthnicity.attr}
          description={`${textStatistics.mostPopularEthnicity.value} people`}/>
        <TextStatistics 
          name="Most Common Education"
          statistic={textStatistics.highestEducationLevels.attr}
          description={`${textStatistics.highestEducationLevels.value} people`}/>
        <TextStatistics 
          name="Most Common Employment Status"
          statistic={textStatistics.mostCommonEmployment.attr}
          description={`${textStatistics.mostCommonEmployment.value} people`}/>
        <TextStatistics 
          name="Parks"
          statistic={this.props.data.parks.count}
          description={`Parks cover ${Math.round(this.props.data.parks.coverage*100)/100}% of this neighborhood`}
        />
        <TextStatistics 
          name="Elementary Schools"
          statistic={this.props.data.schools.elementary}
        />
        <TextStatistics 
          name="High Schools"
          statistic={this.props.data.schools.secondary}
        />
        <TextStatistics 
          name="Fire Stations"
          statistic={this.props.data.fireStations}
        />
        <BarChart name="Income by Household" chartId="income-chart"
                  data={this.props.data.income.households} />
        <BarChart name="Commute Time" chartId="commute-time-chart"
                  data={this.props.data.transit.travelTimeToWork} />
        <PieChart name="Commute Method" chartId="commute-meth-chart"
                  data={this.props.data.transit.transitMethod} />
        <PieChart name="Housing" chartId="housing-chart"
                  data={this.props.data.housing} />
      </div>
    );
  }
}
