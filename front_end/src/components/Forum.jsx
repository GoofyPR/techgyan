import React, {useState} from 'react';

import Questions from './Questions';
import FullQuestionView from './FullQuestionView';
import '../css/Questions.css';

const Forum = ({ searchQuery }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  

  const handleQuestionClick = (questionId) => {
    console.log("Question clicked in Forum:", questionId);
    setSelectedQuestion(questionId);
  }


  return (
    <div className='forum-container'>
      {selectedQuestion ? (
        <FullQuestionView key={selectedQuestion} questionId={selectedQuestion} />
      ) : (
        <Questions onQuestionClick = {handleQuestionClick} searchQuery={searchQuery} />

      )}
    </div>
  )
}

export default Forum;