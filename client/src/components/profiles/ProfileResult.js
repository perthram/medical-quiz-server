import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class ProfileResult extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: {}, selectedSubject: null };
  }
  componentDidMount() {
    this.loadCategories();
  }
  loadCategories = () => {
    const { quizresults } = this.props;
    let categories = {};
    let selectedSubject = quizresults[0].subject;
    quizresults.forEach(el => {
      let date = new Date(el.date);
      let dateTime =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' @ ' +
        date.getHours() +
        ':' +
        date.getMinutes();

      if (categories.hasOwnProperty(el.subject)) {
        categories[el.subject].push({
          score: el.score,
          date: dateTime,
        });
      } else {
        categories[el.subject] = [{ score: el.score, date: dateTime }];
      }
    });
    this.setState({ categories, selectedSubject });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.selectedProfile !== this.props.selectedProfile) {
      this.loadCategories();
    }
  }

  handleChange = event => {
    this.setState({
      selectedSubject: event.target.value,
    });
  };

  render() {
    const { categories, selectedSubject } = this.state;
    const options =
      Object.keys(categories).length > 0
        ? Object.keys(categories).map(el => (
            <option key={el} value={el}>
              {el}
            </option>
          ))
        : [];
    const chartOptions = selectedSubject
      ? {
          title: {
            text: 'Student Score Card for ' + selectedSubject,
          },
          xAxis: {
            categories: categories[selectedSubject].map(el => el.date),
            title: { text: 'TimeStamp' },
          },
          yAxis: { title: { text: 'Score' } },
          series: [
            {
              name: 'Score',
              data: categories[selectedSubject].map(el => parseFloat(el.score)),
            },
          ],
        }
      : {};

    return (
      Object.keys(categories).length > 0 && (
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <select
                className="custom-select"
                value={selectedSubject}
                onChange={this.handleChange}
              >
                {options}
              </select>
            </div>
          </div>
          {selectedSubject && (
            <div className="row mt-2">
              <div className="col-xs-12">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                />
              </div>
            </div>
          )}
        </div>
      )
    );
  }
}

ProfileResult.propTypes = {
  quizresults: PropTypes.array.isRequired,
  selectedProfile: PropTypes.string.isRequired,
};

export default ProfileResult;
