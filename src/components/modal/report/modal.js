import React, { Component } from 'react';
import {Field, reduxForm} from 'redux-form';
import ModalContent from './modal-content';

class Modal extends Component {
	constructor(props){
		super(props);
	}
	closeWhenParentIsClicked = (event) => {
		if(this.refs.tab_modal == event.target){
			this.props.closeModal(event);
		}
	}
	render(){
		let modal = <div className="tab-modal" onClick={(event)=>this.closeWhenParentIsClicked(event)} ref="tab_modal">
						<ModalContent
							onClose={this.props.closeModal}
							data={this.props.data}
							onSubmit={this.props.handleSubmit(this.props.handleSubmitObservables.bind(this))}
							formParams={this.props.formParams}
						/>
				</div>
		return(
			<div>
				{this.props.showModal && modal}
			</div>
		);
	}
}

export default reduxForm({
	form: 'ModalForm',
	enableReinitialize: true
})(Modal);