import React		from 'react';
import {connect}	from 'react-redux';

import Select		from 'react-select';
import {Creatable, AsyncCreatable}
					from 'react-select';

const SelectInput  = (props) => {
	
	const {async = false, creatable = false} = props;
	
	if(async){
			
		if(creatable){
			return	<div className="react-select">
		        		<AsyncCreatable
		        			{...props}
		        		/>
					</div>;
		}else{
			return	<div className="react-select">
		        		<Select.Async
		        			{...props}
		        		/>
		        	</div>;
		}
		
	}else{
		
		if(creatable){
			return	<div className="react-select">
		        		<Creatable
		        			{...props}
		        		/>
		        	</div>;
		}else{
			return	<div className="react-select">
		        		<Select
		        			{...props}
		        		/>
		        	</div>;
		}	
	}
}

export default connect()(SelectInput);