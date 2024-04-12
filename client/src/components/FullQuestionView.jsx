import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Answer from './Answer';
import '../css/Questions.css';
import '../css/Answers.css';
import { GrFormPrevious } from "react-icons/gr";
// import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day} at ${hours}:${minutes}`;
}

const FullQuestionView = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);
  // const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dynamicHeight = height - 88;

  useEffect(() => {
    console.log("questionId in FullQuestionView:", questionId);
    const fetchQuestion = async () => {
      try {
        const questionResponse = await axios.get(`http://localhost:8000/api/getqbyid/${questionId}`);
        console.log("Fetched question:", questionResponse.data);
        setQuestion(questionResponse.data);

        const answersResponse = await axios.get(`http://localhost:8000/api/getallanswers/${questionId}`);
        setAnswers(answersResponse.data);
        
      } catch (error) {
        console.error("Error fetching questions:", error);
      }

      
    };

    fetchQuestion();
    
  }, [questionId]);

  // const handleAnswerSubmit = async (newAnswer) => {
  //   setAnswers([...answers, newAnswer]);
    
  // };

  const handleAnswerSubmit = async (newAnswer) => {
    setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
  };
  

  const navBack = () => {
    // navigate('/forum');
    window.location.reload(false);
  }


  return (
    <div className='full-question-container' style={{ height: `${dynamicHeight}px` }} >
      <div className="back-container">
        <GrFormPrevious className='back-icon' onClick={navBack} />
        <button className='back' onClick={navBack}>Back</button>

      </div>
      {question ? (
        <div className='full-question'>
          <h2 className='full-question-title'>{question.title}</h2>
          {/* <p>{question.body}</p> */}
          <p className='q-body-1'>{question.body.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}<br />
            </React.Fragment>
          ))}</p>
          {question.images.map((image, index) => (
            <div className="image-container" key={index}>
              <img src={`data:${image.fileType};base64,${image.data}`} alt="Question" />
            </div>
          ))}
          <p className='q-tags-1'>Tags: {question.tags.join(', ')}</p>
          {/* <p className='posted'>Posted by: {question.user.firstName} {question.user.lastName}</p> */}
          {question.user && (
            <p className='posted'>Posted by: <span className='posted-style'> {question.user.firstName} {question.user.lastName} on {formatDate(question.createdAt)}</span></p>
          )}

          
        </div>
      ) : (
        <p>Loading...</p>
      )}


      <div className='answers-container'>
        <h3 className='answers-title'>Answers:</h3>
        {answers.map((answer,index) => (
          <div key={index} className='answer'>
            <p className='a-body'>{answer.body.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}<br />
              </React.Fragment>
            ))}</p>
            {answer.images.map((image, imgIndex) => (
              <div className="image-container" key={imgIndex}>
                <img src={`data:${image.fileType};base64,${image.data}`} alt="Answer" />
              </div>
            ))}
            {answer.user && (
              <p className='posted'>Posted by: <span className='posted-style'>{answer.user.firstName} {answer.user.lastName} on {formatDate(answer.createdAt)}</span></p>

            )}
          </div>
        ))}
      </div>
      <Answer questionId={questionId} onAnswerSubmit={handleAnswerSubmit} />

    </div>
  );
}

export default FullQuestionView;