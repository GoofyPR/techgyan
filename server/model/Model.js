const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    firstName:{
      type:String,
      required: true,
    },

    lastName:{
      type: String,
      required: true,
    },

    profilePicture:{
      type: String,
      required: false,
      default: null,
    },

    createdAt:{
      type: Date,
      default: Date.now
    },

    updatedAt:{
      type: Date,
      default: Date.now
    },

    login:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Login',
      required: true,
      
    }

    

});

const loginSchema = new mongoose.Schema({
  
  username:{
    type: String,
    required: true,
    unique: true,
  },

  email:{
    type: String,
    required: true,
    unique: true,
  },

  password:{
    type: String,
    required: true,
  },

  createdAt:{
    type: Date,
    default: Date.now,

  },

  updatedAt:{
    type: Date,
    default: Date.now,
  }



});

const questionSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },

  body:{
    type: String,
    required: false
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt:{
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  tags:[
    {
      type: String,
      required: true
    }
  ],

  images: [
    {
      fileName: {
        type: String,
        required: false
      },

      fileType: {
        type: String,
        required: true,
      },

      data: {
        type: String,
        required: true
      }
      
    }
  ],

});

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  question:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required:true
  },
  images: [
    {
      fileName: {
        type: String,
        required: false
      },

      fileType: {
        type: String,
        required: true,
      },

      data: {
        type: String,
        required: true
      }
    }
  ],

});

const User = mongoose.model('User',userSchema);
const Login = mongoose.model('Login',loginSchema);
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer',answerSchema);

module.exports = { User, Login, Question, Answer };
