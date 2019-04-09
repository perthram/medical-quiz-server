const express = require('express');
const router = express.Router();
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const passport = require('passport');
const isEmpty = require('../../validations/is-empty');

const upload = multer();

//Load File model
const FileUpload = require('../../models/File');
//Load File Validation
const validateFileInput = require('../../validations/file');

//@route POST api/fileupload
//@desc Upload files
//@access Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('quizdata'),
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ filenotfound: 'No file attachement found' });
    }
    const { errors, isValid } = validateFileInput(req.file);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const result = excelToJson({
      source: req.file.buffer,
      header: {
        rows: 1,
      },
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    });

    Object.keys(result).forEach(key => {
      FileUpload.findOne({ name: key }).then(file => {
        if (file) {
          result[key].forEach(item => file.data.push(item));
          file.lastUpdated = Date.now();
          file.save();
        } else {
          const newfile = new FileUpload({
            name: key,
            data: result[key],
          });
          newfile.save();
        }
      });
    });

    return res.json({ success: true });
  }
);

//@route GET api/fileupload/retrieve
//@desc Get Uploaded files
//@access Private

router.get(
  '/retrieve',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    FileUpload.find()
      .sort({ date: -1 })
      .then(files => res.json(files))
      .catch(() => res.status(404).json({ nofilefound: 'No File found' }));
  }
);

//@route GET api/fileupload/retrieve/:categoryname
//@desc Get data for particular category
//@access Private

router.get(
  '/retrieve/:categoryname',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    FileUpload.findOne({ name: req.params.categoryname })
      .then(file => {
        if (file) return res.json(file);
        return res.status(404).json({
          nofilefound:
            'No data for the category ' + req.params.categoryname + ' found',
        });
      })
      .catch(() =>
        res.status(404).json({
          nofilefound:
            'No data for the category ' + req.params.categoryname + ' found',
        })
      );
  }
);

////@route GET api/fileupload/categories
//@desc Get All categories
//@access Private

router.get(
  '/categories',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    FileUpload.find()
      .sort({ date: -1 })
      .then(files => {
        const categories = [];
        files.forEach(file => {
          if (file.data.length > 0) {
            categories.push(file.name);
          }
        });
        return res.json(categories);
      })
      .catch(() => res.status(404).json({ nofilefound: 'No File found' }));
  }
);

////@route GET api/fileupload/fields/:categoryname
//@desc Get fields for particular category
//@access Private
router.get(
  '/fields/:categoryname',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    FileUpload.findOne({ name: req.params.categoryname })
      .then(file => {
        const fields = Object.keys(file.data[0]);
        return res.json({ fields: fields });
      })
      .catch(() => res.status(404).json({ nofilefound: 'No File found' }));
  }
);

////@route PUT api/fileupload/updateCategory/:categoryname
//@desc update data for particular category
//@access Private
router.put(
  '/updateCategory/:categoryname',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    FileUpload.findOne({ name: req.params.categoryname })
      .then(file => {
        if (file) {
          const recievedObj = Object.assign({}, req.body);
          const keysnotfound = Object.keys(file.data[0]).filter(
            key => !recievedObj.hasOwnProperty(key) || isEmpty(recievedObj[key])
          );
          if (keysnotfound.length === 0) {
            file.data.push(req.body);
            file.save().then(() =>
              res.json({
                message: 'Data updated for category ' + req.params.categoryname,
              })
            );
          } else {
            return res.status(400).json({
              keysnotfound:
                'No values for ' + keysnotfound.toString() + ' found',
            });
          }
        } else {
          new FileUpload({ name: req.params.categoryname, data: [req.body] })
            .save()
            .then(() =>
              res.json({
                message: 'Data Stored for category ' + req.params.categoryname,
              })
            );
        }
      })
      .catch(() => res.status(404).json({ nofilefound: 'No File found' }));
  }
);

module.exports = router;
