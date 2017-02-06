import React				from 'react';

import TagInput				from './containers/TagInput.jsx';
import SelectInput			from './containers/SelectInput.jsx';

export const selectGenerator = (options = [], optionComponent = null, valueComponent = null) => {
	
	return (id, value, handleOnChange) => {
										
		return <SelectInput
			options={options}
			optionComponent={optionComponent}
			id={id}
			value={value}
			valueComponent={valueComponent}
			handleOnChange={handleOnChange}
		/>;
	};
};

export const arrayGenerator = (suggestions = [], unique = false, placeholder = "Add new tag") => {
	
	return (id, value = [], handleOnChange) => {
		
		return <TagInput
			tags={value.map((capability, index) => {
				return {id: index, text: capability};
			})}
			id={id}
			suggestions={suggestions}
			unique={unique}
			placeholder={placeholder}
			handleOnChange={handleOnChange}
		/>;
	};
};



export const checkboxGenerator = () => {
	
	return (id, value = false, handleOnChange) => {
		
		const checkboxOnChange = (e) => {
			handleOnChange(id, e.currentTarget.checked);
		}
		
		return <input
			type="checkbox"
			id={id}
			checked={value}
			onChange={checkboxOnChange}
		/>;
	};
}