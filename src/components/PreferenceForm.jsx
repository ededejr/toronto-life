import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import { Button, Modal, Form } from 'react-bootstrap';
import DataSvc from '../services/data-service';
import 'react-input-range/lib/css/index.css';

export default class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);

		// Question text constants
		this.questions = [
			{ title: 'Parks', description: 'importance of the presence of parks and natural spaces in a neighborhood' },
			{ title: 'Wealth', description: 'whether or not you prefer a high average income areas' },
			{ title: 'Housing - Renting', description: 'importance of renting a home' },
			{ title: 'Housing - Owning', description: 'importance of owning a home' },
			{ title: 'Family Life', description: 'importance of the presence of schools and youth services in a neighborhood' },
			{ title: 'Population', description: 'whether or not you enjoy living in highly populated areas' },
			{ title: 'Services', description: 'importance of the presence of police, fire and ambulance services in a neighborhood' },
			{ title: 'Transit', description: 'importance of public transit services in a neighborhood' },
			{ title: 'Culture', description: 'importance of the presence of cultural spaces in a neighborhood' },
			{ title: 'Diversity', description: 'whether or not you enjoy a neighborhood with very diverse residents in terms of religion, language and ethnicity' }
		];

		this.state = {
			opened: false,
			values: this.questions.map(() => 5),
			allowDiversityPrefs: false,
      detailed: false,
			ethnicity: null,
			language: null,
			religion: null
		};

    this.handleShow = this.handleShow.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleDetailed = this.handleDetailed.bind(this);
    this.handleEthnicity = this.handleEthnicity.bind(this);
		this.handleLanguage = this.handleLanguage.bind(this);
		this.handleReligion = this.handleReligion.bind(this);
  }

	getDiversityOptions() {
		return DataSvc.diversityOptions;
	}

	handleShow() {
		this.setState({ opened: true });
	}

	handleClose() {
		this.setState({ opened: false });
	}

	handleSave() {
		let diversityObj = {};

		if(this.state.allowDiversityPrefs) {
			diversityObj.ethnicity = this.state.ethnicity ? this.state.ethnicity.value : null;
			diversityObj.language = this.state.language ? this.state.language.value : null;
			diversityObj.religion = this.state.religion ? this.state.religion.value : null;
		}

		this.props.onSetPreferences(this.state.values, diversityObj, this.state.detailed);
		this.setState({ opened: false });
	}

	handleChange(questionNumber, value) {
		let newValues = this.state.values.slice();
		newValues[questionNumber] = value;
		this.setState({ values: newValues });
	}

	handleEthnicity(newValue){
		this.setState({ ethnicity: newValue });
	}

	handleLanguage(newValue){
		this.setState({ language: newValue });
	}

	handleReligion(newValue){
		this.setState({ religion: newValue });
	}

	handleSwitch(evt) {
		this.setState({ allowDiversityPrefs: evt.target.checked });
	}

  handleDetailed(evt) {
		this.setState({ detailed: evt.target.checked });
	}

	renderRadioButtons() {
		let ranges = this.questions.map((score, i) =>
			<div key={i} className="question-group">
				<b>{this.questions[i].title}</b>
				<p>{this.questions[i].description}</p>
				<InputRange
					maxValue={10}
					minValue={1}
					value={this.state.values[i]}
					onChange={value => this.handleChange(i, value) }
				/>
			</div>
		);

		return ranges;
	}

	renderSwitch() {
		return (
			<div className='question-group'>
				<Form.Check
		    	type="switch"
		    	id="diversity-switch"
		    	label="Filter diversity options"
					checked={this.state.allowDiversityPrefs}
					onChange={this.handleSwitch}
		  	/>
			</div>
		);
	}

	renderDiversityButtons() {
		if(!this.state.allowDiversityPrefs) return null;

		const options = this.getDiversityOptions()

		const ethnicities = options.ethnicities.map(opt => { return { label: opt , value: opt }});
		const languages = options.languages.map(opt => { return { label: opt , value: opt }});
		const religions = options.religions.map(opt => { return { label: opt , value: opt }});

		return (
			<>
				<div className="question-group">
					<Select menuPlacement="auto"
						id='ethnicity-question'
						placeholder='Choose an ethnicity'
						value={this.state.ethnicity}
	          isClearable={true}
						isSearchable={true}
	          options={ethnicities}
						onChange={this.handleEthnicity}
	        />
				</div>
				<div className="question-group">
					<Select menuPlacement="auto"
						id='language-question'
						placeholder='Choose a language'
						value={this.state.language}
	          isClearable={true}
						isSearchable={true}
	          options={languages}
						onChange={this.handleLanguage}
	        />
				</div>
				<div className="question-group">
					<Select menuPlacement="auto"
						id='religion-question'
						placeholder='Choose a religion'
						value={this.state.religion}
	          isClearable={true}
						isSearchable={true}
	          options={religions}
						onChange={this.handleReligion}
	        />
				</div>
			</>
		);
	}

	renderDetailedChoice() {
		return (
			<div className='question-group'>
				<Form.Check
		    	type="switch"
		    	id="detailed-switch"
		    	label="Show detailed heat map for all neighborhoods"
					checked={this.state.detailed}
					onChange={this.handleDetailed}
		  	/>
			</div>
		);
	}

  render() {
		const radioButtons = this.renderRadioButtons();
		const diversitySwitch = this.renderSwitch();
		const diversityButtons = this.renderDiversityButtons();
		const detailedChoice = this.renderDetailedChoice();

    return (
			<div className="pref-button">
				<Button variant="light" onClick={this.handleShow}>
	        Adjust Preferences
	      </Button>

	      <Modal show={this.state.opened} onHide={this.handleClose}>
	        <Modal.Header closeButton>
	          <Modal.Title>Preference Form</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
						{ radioButtons }
						{ diversitySwitch }
						{ diversityButtons }
            { detailedChoice }
					</Modal.Body>
	        <Modal.Footer>
	          <Button variant="secondary" onClick={this.handleClose}>
	            Cancel
	          </Button>
	          <Button variant="primary" onClick={this.handleSave}>
	            Save Changes
	          </Button>
	        </Modal.Footer>
	      </Modal>
			</div>
    );
  }
}
