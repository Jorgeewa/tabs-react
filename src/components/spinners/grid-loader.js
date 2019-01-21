
import React from 'react';
import {css} from 'react-emotion';
import { GridLoader } from 'react-spinners';

const spinner = css`
    display: block;
    margin: 0 auto;
    border-color: red;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
`;
export default () => {
    return(
        <GridLoader
            className={spinner}
            sizeUnit={"px"}
            size={30}
            color={'#123abc'}
        />
    );
}