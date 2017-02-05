import React		from 'react';
import {connect}	from 'react-redux';

import { WithContext as ReactTags }
					from 'react-tag-input';

import Utilities	from "../Utilities.js";

class TagInput extends React.Component{
	
	constructor(props){
		super(props);
		
		this.state = {
			tags: props.tags,
			suggestions: props.suggestions
		};
		
		Utilities.bindAll(this, ["handleChange", "handleDelete", "handleAddition", "handleDrag"]);
	}
	
	handleChange(){
		
		if(this.props.handleOnChange){
			this.props.handleOnChange(this.props.id, this.state.tags.map(el => el.text));
		}
	}
	
	handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        
        this.handleChange();
        this.setState({tags});
    }
    
    handleAddition(tag) {
        let tags = this.state.tags;
        
        if(this.props.unique){
	        
	        for(let i=0;i<tags.length;i++){
		        if(tags[i].text === tag){
			        return;
		        }
	        }
	        
        }
        
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        
        this.handleChange();
        this.setState({tags});
    }
    
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({tags});
    }
	
	render(){
        let {tags, suggestions} = this.state;
        let {placeholder}		= this.props;
        
        return (
        	<div className="clearfix react-tags">
        		<ReactTags tags={tags}
        			suggestions={suggestions}
        			handleDelete={this.handleDelete}
        			handleAddition={this.handleAddition}
        			handleDrag={this.handleDrag}
        			classNames={{
						tags: 'tags-tags',
						tagInput: 'tags-input',
						tagInputField: 'tags-input-field',
						selected: 'tags-selected',
						tag: 'tags-tag',
						remove: 'tags-remove',
						suggestions: 'tags-suggestions',
					}}
					placeholder={placeholder}
        		/>
        	</div>
        )
    }
    
}

export default connect()(TagInput);