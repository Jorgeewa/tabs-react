import React from 'react';

export default (props) => {
  let observables = props.data.map((data, index)=>{
    return(
      <div key={index}>
        {data.observableName}
      </div>
    );
  });

  return observables;
}