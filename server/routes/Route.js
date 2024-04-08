const express = require('express');
const multer = require('multer');
const { signup, signin, createQuestion, signout, getAllQuestions, getQuestionByUserId, deleteQuestion, updateQuestion, createAnswer, deleteAnswer, updateAnswer, getAllAnswers, getAllAnswersByUserId, getQuestionByQuestionId, getUserStats, getRecentQuestionsByUserId, getRecentAnswersByUserId, updateUser } = require('../controller/Controller.js');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Uploads folder
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
    },
  });

const upload = multer({ storage: storage });


const route = express.Router();

route.post('/signup', signup);
route.post('/signin', signin);
route.post('/createq', upload.array('images'), createQuestion);
route.post('/signout', signout);
route.get('/getallq', getAllQuestions);
route.get('/getq/:userId', getQuestionByUserId);
route.delete('/deleteq/:id', deleteQuestion);
route.put('/updateq/:id',upload.array('images'), updateQuestion);
route.post('/createa/:questionId', upload.array('images'),createAnswer);
route.delete('/deletea/:questionId/:id', deleteAnswer);
route.put('/updatea/:questionId/:id', upload.array('images'),updateAnswer);
route.get('/getallanswers/:questionId', getAllAnswers);
route.get('/getallanswersbyuser/:userId', getAllAnswersByUserId);
route.get('/getqbyid/:id', getQuestionByQuestionId);
route.get('/stats', getUserStats);
route.get('/recentq/:userId', getRecentQuestionsByUserId);
route.get('/recenta/:userId', getRecentAnswersByUserId);
route.put('/user/:userId', upload.single('profilePicture'),updateUser);
// route.get('/getAll', getAll);

  // Upload image route
// route.post('/upload-image', upload.single('image'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }
  
//       // You can save the image URL to a database or return it in the response
//         const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//         res.status(200).json({ imageUrl: imageUrl });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

module.exports = route;
