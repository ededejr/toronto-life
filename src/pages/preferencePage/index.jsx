import React, { Component } from 'react';
import LinkButton from '../../components/LinkButton';
import InputRange from 'react-input-range';
import Select from 'react-select';
import { Modal } from 'react-bootstrap';
import DataSvc from '../../services/data-service';
import 'react-input-range/lib/css/index.css';
import './styles.scss';

class PreferencePage extends Component {
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

		this.diversityQuestions = [
 			'Text for ethnicity question',
 			'Text for language question',
 			'Text for religion question'
		];

		this.state = {
			opened: true,
			values: this.questions.map(() => 5),
			allowDiversityPrefs: false,
			ethnicity: null,
			language: null,
			religion: null
		};

    this.handleSave = this.handleSave.bind(this);
    this.handleEthnicity = this.handleEthnicity.bind(this);
		this.handleLanguage = this.handleLanguage.bind(this);
		this.handleReligion = this.handleReligion.bind(this);
  }

	getDiversityOptions() {
		return DataSvc.diversityOptions;
	}

	handleSave() {
		let diversityObj = {};

		if(this.state.allowDiversityPrefs) {
			diversityObj.ethnicity = this.state.ethnicity ? this.state.ethnicity.value : null;
			diversityObj.language = this.state.language ? this.state.language.value : null;
			diversityObj.religion = this.state.religion ? this.state.religion.value : null;
		}

    return {
      values: this.state.values,
      diversity: {
        ethnicity: this.state.ethnicity,
        religion: this.state.religion,
        language: this.state.language
      }
    }
	}

	handleChange(questionNumber, value) {
		let newValues = this.state.values.slice();
    newValues[questionNumber] = value;
    
    if (questionNumber === newValues.length - 1) {
      if (value < 5) {
        this.setState({ allowDiversityPrefs: true })
      } else {
        this.setState({ allowDiversityPrefs: false })
      }
    }

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

	renderDiversityButtons() {
		if(!this.state.allowDiversityPrefs) return null;

		const options = this.getDiversityOptions()

		const ethnicities = options.ethnicities.map(opt => { return { label: opt , value: opt }});
		const languages = options.languages.map(opt => { return { label: opt , value: opt }});
		const religions = options.religions.map(opt => { return { label: opt , value: opt }});

		return (
			<>
        <div className="diversity-header">
          <div className="diversity-header-title">Diversity Options</div>
          <div className="diversity-header-subtitle">We noticed you don't want a lot of diversity, use the following fields to tell us a little bit about what you're looking for</div>
        </div>
				<div className="question-group">
					<Select
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
					<Select
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
					<Select
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

  render() {
		const radioButtons = this.renderRadioButtons();
		const diversityButtons = this.renderDiversityButtons();

    return (
      <div className="preferencePage-container">
        <div className="preferencePage-header">
          <Modal.Title>Preference Form</Modal.Title>
          <div className="subtitle">Use this form to describe what you're looking for</div>
        </div>
        <div className="preferencePage-body">
          { radioButtons }
          { diversityButtons }
        </div>
        <div className="preferencePage-actions">
          <LinkButton route="/" text="Cancel" />
          <LinkButton route="/results" text="Start" action={this.handleSave} />
        </div>
      </div>
    );
  }
}

export default PreferencePage;