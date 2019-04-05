import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';
import {
  updateDataforCategory,
  clearMessage,
} from '../../actions/categoryActions';
import isEmpty from '../../validations/is-empty';
import classnames from 'classnames';

class CreateNewCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryname: '',
      errors: {},
      fieldItems: [],
      showErrorForFields: [],
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
      this.newcatform.reset();
      this.setState({ message: nextprops.message });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addNewField = e => {
    e.preventDefault();
    const { fieldItems } = this.state;
    const len = fieldItems.length;
    let newFieldItems = fieldItems;
    let showErrorForFields = [];
    newFieldItems.push(
      <div className="row" key={len + 1}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg newCatFieldName"
            placeholder=" * Field Name"
            name={'name' + len + 1}
            onChange={this.removeItemFromErrorList.bind(this, 'name' + len + 1)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg newCatFieldValue"
            placeholder=" * Field Value"
            name={'value' + len + 1}
            onChange={this.removeItemFromErrorList.bind(
              this,
              'value' + len + 1
            )}
          />
        </div>
      </div>
    );
    showErrorForFields.push('name' + len + 1, 'value' + len + 1);

    this.setState({ fieldItems: newFieldItems, showErrorForFields });
  };

  removeItemFromErrorList = item => {
    let updatedErrorItems = this.state.showErrorForFields;
    if (
      !isEmpty(document.querySelector(`input[name=${item}]`).value) &&
      updatedErrorItems.indexOf(item) > -1
    ) {
      updatedErrorItems.splice(updatedErrorItems.indexOf(item), 1);
    } else if (
      isEmpty(document.querySelector(`input[name=${item}]`).value) &&
      updatedErrorItems.indexOf(item) === -1
    ) {
      updatedErrorItems.push(item);
    }

    this.setState({ showErrorForFields: updatedErrorItems });
  };

  onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    let formData = {};

    const formFieldNames = document.querySelectorAll('.newCatFieldName');
    const formFieldValues = document.querySelectorAll('.newCatFieldValue');

    formFieldNames.forEach((el, index) => {
      formData[el.value] = formFieldValues[index].value;
    });

    this.props.updateDataforCategory(this.state.categoryname, formData);
    this.setState({
      categoryname: '',
      fieldItems: [],
    });
  };

  clearMessage = () => {
    this.setState({ message: null });
    this.props.clearMessage();
  };

  render() {
    const { categoryname, errors, fieldItems, showErrorForFields } = this.state;
    const { message, categories } = this.props;

    return (
      <div className="create-new-category mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <small className="d-block pb-3">* = required fields</small>
              <form
                onSubmit={this.onSubmit}
                ref={cmp => (this.newcatform = cmp)}
              >
                <TextFieldGroup
                  placeholder="* Category Name"
                  value={categoryname}
                  name="categoryname"
                  error={
                    categories.indexOf(categoryname) > -1
                      ? 'Category name already exists'
                      : errors.nofilefound
                  }
                  info="please type in your category name"
                  onChange={this.onChange}
                />
                {!isEmpty(fieldItems) &&
                  categories.indexOf(categoryname) === -1 &&
                  fieldItems}
                {!isEmpty(categoryname) &&
                categories.indexOf(categoryname) === -1 ? (
                  <input
                    type="button"
                    value="Add Fields"
                    className="btn btn-info btn-block mt-4"
                    onClick={this.addNewField}
                  />
                ) : null}
                {!isEmpty(fieldItems) &&
                  categories.indexOf(categoryname) === -1 && (
                    <input
                      type="submit"
                      value="Create Category"
                      className={classnames('btn btn-block mt-4', {
                        'btn-info': showErrorForFields.length === 0,
                      })}
                      disabled={showErrorForFields.length > 0}
                    />
                  )}
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

CreateNewCategory.propTypes = {
  errors: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  updateDataforCategory: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
};

export default connect(
  null,
  { updateDataforCategory, clearMessage }
)(CreateNewCategory);
