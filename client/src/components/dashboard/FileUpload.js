import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadFile, clearMessage } from '../../actions/categoryActions';
import isEmpty from '../../validations/is-empty';

import InputGroup from '../common/InputGroup';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
    };
  }
  onChange = e => {
    let file = e.target.files[0];
    this.setState({ file: file });
  };

  clearFiles = () => {
    this.form.reset();
  };

  onSubmit = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('quizdata', this.state.file);
    this.props.uploadFile(formData);
  };

  componentWillReceiveProps(nextprops) {
    if (nextprops.message === 'File uploaded successfully') {
      this.clearFiles();
      this.setState({ message: nextprops.message });
    }
  }
  componentWillUnmount() {
    this.clearFiles();
  }

  clearMessage = () => {
    this.setState({ message: null });
    this.props.clearMessage();
  };

  render() {
    const { errors } = this.props;
    const { message } = this.state;

    return (
      <div className="upload-file mt-4">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <form onSubmit={this.onSubmit} ref={cmp => (this.form = cmp)}>
                <InputGroup
                  placeholder="choose a file"
                  name="quizdata"
                  icon="fas fa-cloud-upload-alt"
                  onChange={this.onChange}
                  type="file"
                  clearFiles={this.clearFiles}
                  error={errors.size || errors.mimetype || errors.filenotfound}
                />
                <input type="submit" value="Upload" className="btn btn-info" />
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

FileUpload.propTypes = {
  uploadFile: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  clearMessage: PropTypes.func.isRequired,
};

export default connect(
  null,
  { uploadFile, clearMessage }
)(FileUpload);
