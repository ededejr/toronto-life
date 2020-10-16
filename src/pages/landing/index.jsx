import React, { Component } from 'react';
import LinkButton from '../../components/LinkButton';
import './styles.scss';

class Landing extends Component {
  render () {
    return (
      <div className="landing-container">
        <div className="landing-header">
          <div className="landing-header-title">TorontoLife</div>
        </div>
        <div className="landing-content">
          <div className="landing-content-body">Use this tool to determine what Toronto neighborhoods are best for you</div>
          <LinkButton route="/preferences" text="Get Started"/>
        </div>
      </div>
    )
  }
}

export default Landing;