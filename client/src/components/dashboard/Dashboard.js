import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllCategories } from '../../actions/categoryActions';
import FileUpload from './FileUpload';
import SelectCategory from './SelectCategory';
import CreateNewCategory from './CreateNewCategory';
import classnames from 'classnames';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabId: 'file-upload',
    };
  }
  componentDidMount() {
    this.props.getAllCategories();
  }

  render() {
    const { user } = this.props.auth;
    const { categories, message, fields, loading } = this.props.category;
    const { errors } = this.props;
    const { selectedTabId } = this.state;

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="lead text-muted mb-3">Welcome {user.name}</p>
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a
                    className="nav-item nav-link active"
                    id="nav-file-upload-tab"
                    data-toggle="tab"
                    href="#nav-file-upload"
                    role="tab"
                    aria-controls="nav-file-upload"
                    aria-selected="true"
                    onClick={() =>
                      this.setState({ selectedTabId: 'file-upload' })
                    }
                  >
                    File Upload
                  </a>
                  <a
                    className={classnames('nav-item nav-link', {
                      disabled: categories.length === 0,
                    })}
                    id="nav-sel-category-tab"
                    data-toggle="tab"
                    href="#nav-sel-category"
                    role="tab"
                    aria-controls="nav-sel-category"
                    aria-selected="false"
                    aria-disabled={categories && categories.length === 0}
                    onClick={() =>
                      this.setState({ selectedTabId: 'sel-category' })
                    }
                  >
                    Select Category
                  </a>
                  <a
                    className="nav-item nav-link"
                    id="nav-new-category-tab"
                    data-toggle="tab"
                    href="#nav-new-category"
                    role="tab"
                    aria-controls="nav-new-category"
                    aria-selected="false"
                    onClick={() =>
                      this.setState({ selectedTabId: 'new-category' })
                    }
                  >
                    Create New Category
                  </a>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-file-upload"
                  role="tabpanel"
                  aria-labelledby="nav-file-upload-tab"
                >
                  {selectedTabId === 'file-upload' && (
                    <FileUpload errors={errors} message={message} />
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-sel-category"
                  role="tabpanel"
                  aria-labelledby="nav-sel-category-tab"
                >
                  {selectedTabId === 'sel-category' && (
                    <SelectCategory
                      categories={categories}
                      errors={errors}
                      categoryfields={fields}
                      loading={loading}
                      message={message}
                    />
                  )}
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-new-category"
                  role="tabpanel"
                  aria-labelledby="nav-new-category-tab"
                >
                  {selectedTabId === 'new-category' && (
                    <CreateNewCategory
                      errors={errors}
                      message={message}
                      categories={categories}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getAllCategories: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  category: state.category,
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { getAllCategories }
)(Dashboard);
