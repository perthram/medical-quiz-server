import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectListGroup from '../common/SelectListGroup';
import Spinner from '../common/Spinner';
import isEmpty from '../../validations/is-empty';
import classnames from 'classnames';
import {
  getFieldsforCategory,
  updateDataforCategory,
  clearMessage,
} from '../../actions/categoryActions';

class SelectCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryname: '',
      errors: {},
    };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.errors) {
      this.setState({ errors: nextprops.errors });
    }
    if (
      nextprops.message ===
      'Data updated for category ' + this.state.categoryname
    ) {
      this.catform.reset();
      this.setState({ message: nextprops.message });
    }
  }

  onSelectInputChange = e => {
    this.setState({ categoryname: e.target.value });
    this.props.getFieldsforCategory(e.target.value);
  };

  clearMessage = () => {
    this.setState({ message: null });
    this.props.clearMessage();
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    let formData = {};
    const formfields = document.querySelectorAll('.select-catergory-fields');
    formfields.forEach(el => {
      if (el.name) formData[el.name] = el.value;
    });

    this.props.updateDataforCategory(this.state.categoryname, formData);
  };

  render() {
    const { categories, categoryfields, loading } = this.props;
    const { categoryname, errors, message } = this.state;
    let options = categories.map(category => {
      return { label: category, value: category };
    });
    options.unshift({ label: 'Select a Category', value: '' });

    return (
      <div className="select-category mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <small className="d-block pb-3">* = required fields</small>

              <SelectListGroup
                name="categories"
                value={categoryname}
                onChange={this.onSelectInputChange}
                error={errors.nofilefound}
                options={options}
                info="Please select a category from the list "
              />

              {loading && <Spinner />}

              <form onSubmit={this.onSubmit} ref={cmp => (this.catform = cmp)}>
                {categoryfields && categoryfields.length > 0 ? (
                  <React.Fragment>
                    {categoryfields.map((field, index) => (
                      <div className="form-group" key={index}>
                        <input
                          className={classnames(
                            'form-control form-control-lg select-catergory-fields',
                            {
                              'is-invalid':
                                Object.keys(errors).length > 0 &&
                                errors.keysnotfound &&
                                errors.keysnotfound.indexOf(field) > -1,
                            }
                          )}
                          placeholder={'* ' + field}
                          name={field}
                          type="text"
                        />
                      </div>
                    ))}
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-info btn-block mt-4"
                    />
                  </React.Fragment>
                ) : null}
              </form>
              {!isEmpty(message) ? (
                <div
                  className="alert alert-success alert-dismissible fade show mt-3"
                  role="alert"
                >
                  {message}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={this.clearMessage}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SelectCategory.propTypes = {
  getFieldsforCategory: PropTypes.func.isRequired,
  updateDataforCategory: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  categoryfields: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default connect(
  null,
  { getFieldsforCategory, updateDataforCategory, clearMessage }
)(SelectCategory);
