import React, { Component } from 'react';
import { Route } from 'react-router-dom'

export default class LinkButton extends Component {
  buttonText = null;
  route = null;

  constructor(props) {
    super(props);

    this.buttonText = props.text;
    this.route = props.route;
    this.action = props.action;
  }


  render() {
    return (<Route render={({ history }) => (
      <button
        type='button'
        onClick={() => { 
          if (this.action) {
            const load = this.action();
            history.push({
              pathname: this.route,
              state: load
            });
          } else {
            history.push(this.route);
          }
        }}
      >
        {this.buttonText}
      </button>
    )} />)
  }
}