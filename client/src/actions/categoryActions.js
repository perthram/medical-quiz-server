import axios from 'axios';
import {
  FILE_UPLOADED,
  FETCHING,
  GET_ERRORS,
  GET_CATEGORIES,
  CLEAR_ERRORS,
  GET_FIELDS,
  CLEAR_MESSAGE,
} from './types';

//Upload Data for file
export const uploadFile = fileData => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/fileupload', fileData)
    .then(res => {
      dispatch({
        type: FILE_UPLOADED,
        payload: 'File uploaded successfully',
      });
      dispatch(getAllCategories());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Get Categories
export const getAllCategories = () => dispatch => {
  axios
    .get('/api/fileupload/categories')
    .then(res =>
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data,
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CATEGORIES,
        payload: [],
      })
    );
};

// Get fields of particular category
export const getFieldsforCategory = catergoryName => dispatch => {
  dispatch(fetching());
  axios
    .get(`/api/fileupload/fields/${catergoryName}`)
    .then(res =>
      dispatch({
        type: GET_FIELDS,
        payload: res.data.fields,
      })
    )
    .catch(err => dispatch({ type: GET_FIELDS, payload: [] }));
};

//update data for category
export const updateDataforCategory = (catergoryName, data) => dispatch => {
  axios
    .put(`/api/fileupload/updateCategory/${catergoryName}`, data)
    .then(res => {
      dispatch({
        type: FILE_UPLOADED,
        payload: res.data.message,
      });
      dispatch(getAllCategories());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    )
    .catch(err => dispatch({ type: GET_FIELDS, payload: [] }));
};

//fecthing data
export const fetching = () => {
  return {
    type: FETCHING,
  };
};

//Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

//Clear message
export const clearMessage = () => {
  return {
    type: CLEAR_MESSAGE,
  };
};
