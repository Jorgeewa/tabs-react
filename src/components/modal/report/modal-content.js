import React from 'react';
import SelectList from './select-list';
import RobotObservables from './robot-observables';
import {Field} from 'redux-form';

export default (props) => {
  return(
      <div className="tab-modal-content">
        <span className="close-tab" onClick={props.onClose}>&times;</span>
        <br/>
        <div className="modal-form-holder">
          Selected Options
          <div className="choosen-observables">
            <RobotObservables data={props.data} />
          </div>
          <form onSubmit={props.onSubmit}>
            <Field
              label="Select observable"
              data={props.formParams.observables}
              name="observable"
              component={SelectList}
            />
            <Field
              label="Select round"
              data={props.formParams.rounds}
              name="round"
              component={SelectList}
            />
            <Field
              label="Select chart type"
              data={props.formParams.chartTypes}
              name="chart-type"
              component={SelectList}
            />

            <button type="submit" className = "btn btn-primary">
              Add
            </button>
          </form>
        </div>
        <div className="">
          <button className = "btn btn-primary" onClick={props.onClose}>
              Ok
          </button>
        </div>
      </div>
  );
}