import React from 'react';
import { Card } from 'react-bootstrap';

export default class TextStatistics extends React.Component {
  render() {
    return (
      <div className="statistics-box">
        
        <h6 className='text'>{this.props.name}</h6>
        
        <Card.Body>
          <Card.Title>{this.props.statistic}</Card.Title>
          <Card.Text>{this.props.description}</Card.Text>
        </Card.Body>
      </div>
    );
  }
}
