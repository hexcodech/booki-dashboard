import React
       from 'react';

import TagInput
      from 'web/components/form/input/TagInput.jsx';
import SelectInput
       from 'web/components/form/input/select/SelectInput.jsx';

export const selectInput = (
  props, onSelect = null
) => {

	return (id, value, errors, handleOnChange) => {

		const onChange = (option) => {
			let val = option && option.value ? option.value : '';

			handleOnChange(id, val);

			if(onSelect){
				onSelect(val);
			}
		};

		return <SelectInput
			{...props}
			onChange={onChange}
			id={id}
			value={value}
		/>;

	};
};

export const arrayInput = (
	suggestions = [], unique = false, placeholder = 'Add new tag'
) => {

	return (id, values = [], errors = {}, handleOnChange) => {

    let css = '';
    for(let index in errors){
      css += `.tags-tag:nth-child(${(parseInt(index) + 1)}){
        box-shadow: 0 0 4px 1px #e74c3c;
      }`;
    }

		return (<div>
      <style>{css}</style>
      <TagInput
  			tags={values.map((value, index) => {
  				return {id: index, text: value};
  			})}
  			id={id}
  			suggestions={suggestions}
  			unique={unique}
  			placeholder={placeholder}
  			handleOnChange={handleOnChange}
      />
    </div>);
	};
};

export const checkboxInput = (defaultValue = false) => {

	return (id, value = defaultValue, errors, handleOnChange) => {

		const checkboxOnChange = (e) => {
			handleOnChange(id, e.currentTarget.checked);
		}

		return <input
			type='checkbox'
			id={id}
			checked={value}
			onChange={checkboxOnChange}
		/>;
	};
}

export const textAreaInput = (
	defaultValue = '', placeholder = '', rows = 4, cols = 50, dynamicSize = true
) => {

	return (id, value = defaultValue, errors, handleOnChange) => {

		const textAreaOnChange = (e) => {
			handleOnChange(id, e.currentTarget.value);
		}

		return <textarea
			id={id}
			style={{
				resize: dynamicSize ? 'vertical' : 'none'
			}}
			className='form-control'
			onChange={textAreaOnChange}
			placeholder={placeholder}
			rows={rows}
			cols={cols}
			value={value}
		/>;
	};
}
