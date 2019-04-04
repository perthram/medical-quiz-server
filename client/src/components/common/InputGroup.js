import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  icon,
  type,
  onChange,
  clearFiles,
}) => {
  return (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className={icon} />
        </span>
      </div>
      <input
        className={classnames('form-control form-control-lg', {
          'is-invalid': error,
        })}
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
      <div
        className="input-group-append"
        onClick={clearFiles}
        style={{ cursor: 'pointer' }}
      >
        <span className="input-group-text">
          {' '}
          <i className="fas fa-times" />
        </span>
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  clearFiles: PropTypes.func,
};

InputGroup.defaultProps = {
  type: 'text',
};

export default InputGroup;
