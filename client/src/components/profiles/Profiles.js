import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import { getProfiles } from '../../actions/profileActions';
import classnames from 'classnames';
import ProfileResult from './ProfileResult';

class Profiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProfile: null,
    };
  }
  componentDidMount() {
    this.props.getProfiles();
  }

  handleChange = event => {
    this.setState({
      selectedProfile: event.target.value,
    });
  };

  render() {
    const { profiles, loading } = this.props.profile;
    const { selectedProfile } = this.state;
    let profileItems;
    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        let headers = ['Select', 'Name', 'RollNo.'];
        let rows = profiles.map(el => (
          <tr
            className={classnames({
              'table-info': selectedProfile === el.user.rollnumber,
            })}
            key={el.user.rollnumber}
          >
            <td>
              <input
                className="form-check-input ml-1"
                type="radio"
                onChange={this.handleChange}
                name="studentprofile"
                value={el.user.rollnumber}
                checked={selectedProfile === el.user.rollnumber}
              />
            </td>
            <td>{el.user.name}</td>
            <td>{el.user.rollnumber}</td>
          </tr>
        ));

        profileItems = (
          <table className="table table-hover">
            <thead>
              <tr>
                {headers.map(el => (
                  <th key={el}>{el}</th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        );
      } else {
        profileItems = <h4>No Profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Student Profiles</h1>
              <p className="lead text-center">
                Select a profile to view test results
              </p>
              {profileItems}
              {selectedProfile && (
                <ProfileResult
                  quizresults={
                    profiles.find(el => el.user.rollnumber === selectedProfile)
                      .quizresults
                  }
                  selectedProfile={selectedProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
