import React		from 'react';
import {connect}	from 'react-redux';

import Select		from 'react-select';

import Utilities	from "../Utilities.js";

class TagInput extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, ["handleChange"]);
	}
	
	handleChange(option){
		if(this.props.handleOnChange){
			let value = option && option.value ? option.value : '';
			this.props.handleOnChange(this.props.id, value);
		}
	}
	
		
	render(){
        return (
        	<div className="react-select">
        		<Select
        			options={this.props.options}
        			optionComponent={this.props.optionComponent}
        			onChange={this.handleChange}
        			name={this.props.id}
        			value={this.props.value}
        			valueComponent={this.props.valueComponent}
        		/>
        	</div>
        )
    }
    
}

export default connect()(TagInput);