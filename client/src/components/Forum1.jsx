import React, {useState} from 'react';
import MyQuestions from './MyQuestions';
import FullQuestionView from './FullQuestionView';
import '../css/MyQuestions.css';

const Forum1 = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (questionId) => {
    console.log("Question clicked in Forum:", questionId);
    setSelectedQuestion(questionId);
  }


  return (
    <div className='forum1-container'>
      {selectedQuestion ? (
        <FullQuestionView key={selectedQuestion} questionId={selectedQuestion} />
      ) : (
        <MyQuestions onQuestionClick = {handleQuestionClick} />

      )}
    </div>
  )
}

export default Forum1;