import React		from 'react';
import {connect}	from 'react-redux';

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
        	<table>
        	
        	</table>
        )
    }
    
}

export default connect()(TagInput);