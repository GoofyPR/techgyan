const bcrypt = require('bcrypt');
const { User, Login, Question, Answer } = require('../model/Model.js');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;


const signup = async(req, res) => {
    try {
        const { username, email, password, firstName, lastName, profilePicture } = req.body;

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(trimmedEmail)){
            return res.status(400).json({ error: "Invalid email format." });
        }

        const passwordRegex = /^.{1,16}$/;
        if(!passwordRegex.test(trimmedPassword)){
            return res.status(400).json({ error: "Password must be between 1 and 16." });
        }

        // console.log('Request body:', req.body); 
        
        // if (!username) {
        //     return res.status(400).json({ error: "Username is required." });
        // }

        const existingUser = await User.findOne({ email: trimmedEmail });
        const existingUser1 = await User.findOne({ username: trimmedUsername });

        if (existingUser){
            // console.log('Existing user with email:', email);
            return res.status(400).json({ error: "Email already exists." });
        }

        if (existingUser1){
            // console.log('Existing user with username:', username);
            return res.status(400).json({ error: "Username already exists." });
        }
        
        const hashedPassword = await bcrypt.hash(trimmedPassword,10);

        // console.log('Creating new login document...');
        const newLogin = new Login({ username: trimmedUsername, email: trimmedEmail, password: hashedPassword });
        await newLogin.save();

        // console.log('New login document created:', newLogin);

        // console.log('Creating new user document...');
        const newUser = new User({ firstName, lastName, profilePicture, login: newLogin._id });
        await newUser.save();

        // console.log('New user document created:', newUser);

        return res.status(200).json(newUser);

    } catch (error) {
        // console.error('Signup error:', error);
        
        if (error.code === 11000){
            if (error.keyPattern.email){
                return res.status(400).json({ error: "Email already exists." });
            } else if (error.keyPattern.username){
                return res.status(400).json({ error: "Username already exists." });
            }
        }
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

// const getAll = async(req,res) =>{
//     try {
//         const userData = await User.find().populate('login');
//         if(!userData){
//             return res.status(404).json("Data not found..");
//         }
//         return res.status(200).json(userData);
//     } catch (error) {
//         // console.error(error);
//         res.status(500).json({error: "Internal server error.."});
//     }
// };

const signin = async(req,res) => {
    try {

        const { emailOrUsername, password } = req.body;
        const trimmedEmailOrUsername = emailOrUsername.trim();

        const byEmail = await Login.findOne({ email: trimmedEmailOrUsername });
        const byUsername = await Login.findOne({ username: trimmedEmailOrUsername });
        const userLogin = byEmail || byUsername;

        if(!userLogin){
            return res.status(400).json({ error: "User not found." });
        }

        const user = await User.findOne({ login: userLogin._id }).populate('login');

        const isPasswordValid = await bcrypt.compare(password, userLogin.password);
        if(!isPasswordValid){
            return res.status(400).json({ error: "Invalid password." })
        }

        user.updatedAt = new Date();
        await user.save();

        const token = jwt.sign({ 
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            updatedAt: user.updatedAt.toISOString(),
            email: user.login.email
        }, process.env.JWT_SECRET);

        // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ token });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal status error." });
        
    }

};

const signout = async(req,res) => {
    try {
        const token = req.headers.authorization? req.headers.authorization.split(' ')[1] : null;
        if(!token) {
            return res.status(400).json({error: 'Unauthorized'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json({error: 'Unauthorized'});
            
        }

        jwt.sign({ _id: decoded._id}, process.env.JWT_SECRET,{ expiresIn: '1s' });
        res.status(200).json({message: 'Signed out'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

const createQuestion = async(req,res) => {
    try {
        const { title, body, tags } = req.body;
        if (!req.body) {
            return res.status(400).json({ error: "Request body is missing." });
        }
        // const userID = req.user._id;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        if (!token) {
            const authHeader = req.headers.authorization;
          
            if (authHeader) {
              const parts = authHeader.split(' ');
          
              if (parts.length === 2) {
                const scheme = parts[0];
                const credentials = parts[1];
          
                if (/^Bearer$/i.test(scheme)) {
                  token = credentials;
                }
              }
            }
          }

        if(!token){
            return res.status(404).json({error: "Authorization header is missing."});
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(404).json({error: "Invalid token."});
            
        }
        const userID = decoded._id;

        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);

        const user = await User.findById(userID);
        if(!user) {
            return res.status(404).json({error: "User not found."});
        }

        // let images = [];
        // if(req.files && req.files.length>0) {
        //     images = req.files.map(file => ({
        //         fileName: file.originalname,
        //         fileType: file.mimetype,
        //         data: file.buffer.toString("base64")
        //     }));
        // } 

        let images = [];
        if (req.body.images) {
    // Check if req.body.images is an array
            if (Array.isArray(req.body.images)) {
                images = req.body.images.map(image => ({
                    fileName: image.fileName,
                    fileType: image.fileType,
                    data: image.data
                }));
            } else {
        // Handle single image case
                images.push({
                    fileName: req.body.images.fileName,
                    fileType: req.body.images.fileType,
                    data: req.body.images.data
                });
            }
        }


        // else if (body) { 
        //     const regex = /<img.*?src=['"](.*?)['"]/g;
        //     let match;
        //     while ((match = regex.exec(body))) {
        //         images.push({
        //             fileName: '', // You can set a default value or leave it empty
        //             fileType: 'image/jpeg', // Set a default value for the fileType
        //             data: match[1].replace(/^data:image\/\w+;base64,/, ""),
        //         });
        //     }
        // }
        

        console.log('Processed images:', images);

        const newQuestion = new Question({ title, body, tags, user: userID, images });
        await newQuestion.save();
        return res.status(200).json(newQuestion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."});
    }
}

const getAllQuestions = async(req,res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."});
    }
}

const getQuestionByUserId = async(req,res) => {
    try {
        const { userId } = req.params;
        const questions = await Question.find({ user: userId });

        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."});
    }
}

const getQuestionByQuestionId = async(req,res) => {
    try {
        const {id} = req.params;
        // const question = await Question.findById(id).populate('user','firstName lastName');
        const question = await Question.findById(id).populate('user');

        if(!question) {
            return res.status(404).json({error: "Question not found."});

        }
        return res.status(200).json(question);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."})
    }
}

const deleteQuestion = async(req,res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization? req.headers.authorization.split(' ')[1] : null;

        if(!token){
            return res.status(404).json({error: "Authorization header is missing."});

        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(404).json({error: "Invalid token."});
        }
        

        const userId = decoded._id;

        // const question = await Question.findById(id);
        // if(!question){
        //     return res.status(404).json({error: "Question not found."});
        // }

        // if(question.user.toString() !== userId){
        //     return res.status(403).json({error: "Unauthorized. Cannot delete the question."});
        // }
        // await question.remove();

        const question = await Question.findOneAndDelete({ _id: id, user: userId });
        if(!question){
            return res.status(404).json({error: "Question not found."});
        }

        
        return res.status(200).json({msg: "Question deleted successfully."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."});
    }
}

const updateQuestion = async(req,res) => {
    try {
        const { id } = req.params;
        const { title, body, tags } = req.body;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        if(!token){
            return res.status(404).json({error: "Authorization header is missing."});
        } 

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(404).json({error: "Invalid token."});
        }

        const userId = decoded._id;

        const question = await Question.findOne({ _id : id, user: userId });
        if(!question){
            return res.status(404).json({error: "Question not found or user unauthorized."});
        }
        
        let images = question.images;
        if(req.files && req.files.length>0) {
            images = req.files.map(file => ({
                fileName: file.originalname,
                fileType: file.mimetype,
                data: file.buffer.toString("base64")
            }));
        }
        
        const updatedq = await Question.findByIdAndUpdate(
            id,
            { title, body, tags, images },
            { new:true }
        );
        return res.status(200).json(updatedq);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error."});
    }
}

const createAnswer = async (req, res) => {
    try {
        const { body } = req.body;
        const questionId = req.params.questionId; 
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  
        if (!token) {
            return res.status(401).json({ error: "Authorization header is missing." });
        }
  
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ error: "Invalid token." });
        }
  
        const userId = decoded._id;
  
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
      
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found." });
        }

        if (!body) {
            return res.status(400).json({ error: "Answer body cannot be empty." });
        }

        // let images = [];
        // if (req.files && req.files.length > 0) {
        //     images = req.files.map(file => ({
        //         fileName: file.originalname,
        //         fileType: file.mimetype,
        //         data: file.buffer.toString("base64")
        //     }));
        // }

        let images = [];
        if (req.body.images) {
   
            if (Array.isArray(req.body.images)) {
                images = req.body.images.map(image => ({
                    fileName: image.fileName,
                    fileType: image.fileType,
                    data: image.data
                }));
            } else {
        
                images.push({
                    fileName: req.body.images.fileName,
                    fileType: req.body.images.fileType,
                    data: req.body.images.data
                });
            }
        }

        console.log("Creating new answer:", { body, user: userId, question: questionId, images });
        const newAnswer = new Answer({ body, user: userId, question: questionId, images });
        await newAnswer.save();
        await newAnswer.populate('user');
        console.log("New answer saved:", newAnswer);
        return res.status(200).json(newAnswer);

        } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const deleteAnswer = async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        if (!token) {
            return res.status(404).json({ error: "Authorization header is missing." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(404).json({ error: "Invalid token." });
        }

        const userId = decoded._id;

        const answer = await Answer.findOneAndDelete({ _id: id, user: userId, question: questionId });
        if (!answer) {
            return res.status(404).json({ error: "Answer not found." });
        }

        return res.status(200).json({ msg: "Answer deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const updateAnswer = async (req, res) => {
    try {
        const { id, questionId } = req.params;
        const { body } = req.body;
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        if (!token) {
            return res.status(404).json({ error: "Authorization header is missing." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(404).json({ error: "Invalid token." });
        }

        const userId = decoded._id;

        const answer = await Answer.findOne({ _id: id, user: userId, question: questionId });
        if (!answer) {
            return res.status(404).json({ error: "Answer not found." });
        }

        let images = answer.images;
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => ({
                fileName: file.originalname,
                fileType: file.mimetype,
                data: file.buffer.toString("base64")
            }));
        }

        const updateda = await Answer.findByIdAndUpdate(
            id,
            { body, images },
            { new: true }
        );
        return res.status(200).json(updateda);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const getAllAnswers = async (req, res) => {
    try {
        const { questionId } = req.params;

        const answers = await Answer.find({ question: questionId }).populate('user');
        return res.status(200).json(answers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const getAllAnswersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const answers = await Answer.find({ user: userId });
        return res.status(200).json(answers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const getUserStats = async (req,res) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

        if(!token){
            return res.status(401).json({error: "Unauthorized"});
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({error: "Invalid token"});
        }

        const userId = decoded._id;
        const userIdObj = new ObjectId(userId);

        // const stats = await Question.aggregate([
        //     { $match: { user: userId } },
        //     { $group: { _id: null, questionCount: { $sum: 1 } } }
            
        // ]).exec();

        // stats.push(
        //     await Answer.aggregate([
        //         { $match: { user: userId } },
        //         { $group: { _id: null, answerCount: { $sum: 1 } } }
                
        //     ]).exec()
        // );

        const [questionStats, answerStats] = await Promise.all([
            Question.aggregate([
                { $match: { user: userIdObj } },
                { $group: { _id: null, questionCount: { $sum: 1 } } }
            ]).exec(),
            Answer.aggregate([
                { $match: { user: userIdObj } },
                { $group: { _id: null, answerCount: { $sum: 1 } } }
            ]).exec()
        ]);


        // const stats = await Promise.all([
        //     Question.aggregate([
        //         { $match: { user: userId } },
        //         { $group: { _id: null, questionCount: { $sum: 1 } } }
        //     ]).exec(),
        //     Answer.aggregate([
        //         { $match: { user: userId } },
        //         { $group: { _id: null, answerCount: { $sum: 1 } } }
        //     ]).exec()
        // ]);

        
        // console.log("Question Stats:", questionStats);
        // console.log("Answer Stats:", answerStats);

        const userStats = {
            userId: userId,
            questionCount: questionStats.length > 0 ? questionStats[0].questionCount : 0,
            answerCount: answerStats.length > 0 ? answerStats[0].answerCount : 0
        };


        // const userStats = {
        //     userId: userId,
        //     stats: stats,
        //     questionCount: stats[0]?.questionCount || 0,
        //     answerCount: stats[1]?.answerCount || 0
        // };


        

        return res.status(200).json(userStats);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getRecentQuestionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const questions = await Question.find({ user: userId }).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
}

const getRecentAnswersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const answers = await Answer.find({ user: userId }).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json(answers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const updateUser = async(req,res) => {
    try {
        const { userId } = req.params;
        const { username, email, password, firstName, lastName, profilePicture } = req.body;

        console.log('req body', req.body); 

        const updates = {};
        if(firstName) updates.firstName = firstName;
        if(lastName) updates.lastName = lastName;
        if(profilePicture) updates.profilePicture = profilePicture;
        // if (req.file && req.file.buffer) {
        //     updates.profilePicture = {
        //         fileName: req.file.originalname,
        //         fileType: req.file.mimetype,
        //         data: req.file.buffer.toString("base64")
        //     };
            
        // }
        updates.updatedAt = new Date();

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        const login = await Login.findById(user.login);

        if(!login) {
            return res.status(404).json({error: "Login not found"});
        }

        if(username) login.username = username;
        if(email) login.email = email;
        if(password) {
            const passwordHashed = await bcrypt.hash(password, 10);
            login.password = passwordHashed;
        }

        await login.save();

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

const getAllUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('login');
        if (!user) {
            return res.status(404).json("User not found.");
        }

        const userData = user.toObject(); // Convert the Mongoose document to a plain JavaScript object

        return res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};



module.exports = { signup, signin, createQuestion, signout, getAllQuestions, getQuestionByUserId, deleteQuestion, updateQuestion, createAnswer, deleteAnswer, updateAnswer, getAllAnswers, getAllAnswersByUserId, getQuestionByQuestionId, getUserStats, getRecentQuestionsByUserId, getRecentAnswersByUserId, updateUser, getAllUserInfo };

