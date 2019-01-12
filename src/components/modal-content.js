import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {addObservable} from '../actions/index';
import {bindActionCreators} from 'redux';

const OBSERVABLES = {
	tempabc: 'temperature',
	humabcd: 'humidity',
	asabcde: 'airspeed',
	co2abcd: 'co2'
};

const CHARTTYPE = ['heatmaps', 'graphs', 'scatterplot'];
const ROUNDS = ['ROUND 1', 'ROUND 2'];
const OBSERVABLEIDS = ['tempabc', 'humabcd', 'asabcde', 'co2abcd'];

class ModalContent extends Component {
	constructor(props){
		super(props);
	}
	
	closeWhenParentIsClicked = (event) => {
		if(this.refs.tab_modal == event.target){
			this.props.closeModal(event);
		}
	}
	
	renderSelectList = (field) => {
		let options = [<option key="null"></option>];
		
		field.data.map((data)=>{
				options.push(<option key={data.id != null ? data.id : data } value={data.id != null ? data.id : data }>
				{data.id != null ? `round ${data.from} ${data.to}` : data }
				</option>)
		});
		return (
			<div className="form-group">
				<label htmlFor="sel1">
					{field.label}
				</label>
				<select 
					className="form-control" 
					id="sel1"
					onChange={field.input.onChange}
				  	{...field.input}
				  >
					{options}
				  
				</select>
			</div>
		 );
	}
	
	renderChoosenObservables = () => {
		let observables = this.props.data.map((data, index)=>{
			return(
				<div key={index}>
					{data.observableName}
				</div>
			);
		});
		
		return observables;
	}
	
	onSubmit(values){
		let data = {
					   "observableId": values.observable,
					   "roundId": values.round,
					   "typeOfChart": values['chart-type'],
					   "observableName": values.observable
					};
		this.props.addObservable({newData: data, id: this.props.tabDetails.id, name: this.props.tabDetails.name});
	}
	
	renderModal = () => {
		const {handleSubmit} = this.props;
		
		return(
			<div className="tab-modal" onClick={(event)=>this.closeWhenParentIsClicked(event)} ref="tab_modal">
				<div className="tab-modal-content">
					<span className="close-tab" onClick={(event)=>this.props.closeModal(event)}>&times;</span>
					<br/>
					<div className="modal-form-holder">
						Selected Options
						<div className="choosen-observables">
							{this.renderChoosenObservables()}
						</div>
						<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
							<Field
								label="Select observable"
								data={this.props.formParams.observables}
								name="observable"
								component={ this.renderSelectList}
							/>
							<Field
								label="Select round"
								data={this.props.formParams.rounds}
								name="round"
								component={ this.renderSelectList}
							/>
							<Field
								label="Select chart type"
								data={this.props.formParams.chartTypes}
								name="chart-type"
								component={ this.renderSelectList}
							/>
							
							<button type="submit" className = "btn btn-primary">
								Add
							</button>
						</form>
					</div>
					<div className="">
						<button className = "btn btn-primary">
								Ok
						</button>	
					</div>
				</div>
			</div>
		);
	}
	
	render(){
		let Modal = this.renderModal();
		return(
			<div>
				{this.props.showModal && Modal}
			</div>
		);
	}
}


function mapDispatchToProps(dispatch){
	return bindActionCreators({addObservable: addObservable}, dispatch);
}

export default connect(null, mapDispatchToProps)(reduxForm({
	form: 'ModalForm',
	enableReinitialize: true
})(ModalContent));