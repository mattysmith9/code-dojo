import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';

class Profiles extends Component {
	render() {
		return (
			<div className="todo">
				<p className="todo" />
			</div>
		);
	}
}

export default Profiles;
