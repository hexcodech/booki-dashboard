import React				from 'react';

import {connect}			from 'react-redux';

import {push}				from 'react-router-redux';

import { WithContext as ReactTags }
							from 'react-tag-input';

import Utilities			from '../../Utilities.js';

class UserCapabilities extends React.Component{
	
	constructor(props){
		super(props);
		
		Utilities.bindAll(this, ["componentDidMount", "handleRefreshClick", "handleUserRowClick"]);
	}
	
	componentDidMount() {
		const {dispatch, accessToken} = this.props;
		
		dispatch(fetchUsersIfNeeded(accessToken));
	}
	
	getInitialState() {
        return {
            tags: [ {id: 1, text: "Apples"} ],
            suggestions: ["Banana", "Mango", "Pear", "Apricot"]
        }
    }
    
    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }
    
    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }
    
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }
	
	render(){
		
		return (
			<div className="lel">
				
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		labels		: state.app.labels.user
	};
}

export default connect(mapStateToProps)(UserCapabilities);