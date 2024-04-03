import React, {useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/MyQuestions.css';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { jwtDecode } from 'jwt-decode';

const MyQuestions = ({ onQuestionClick }) => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(8);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (!token) {
    console.log('token not found.');
  }
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken._id : null;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/getq/${userId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, [userId]);
  
  
  const handleClick = (questionId) => {
    if (questionId) {
      onQuestionClick(questionId);
    }
  };

  const navAskQuestion = () => {
    navigate('/askquestion');
  };

  // const filteredQuestions = questions.filter(
  //   (question) =>
  //     question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  // );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const nextPage = () => {
    console.log('Next page clicked. Current page:', currentPage);
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
        setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    console.log('Previous page clicked. Current page:', currentPage);
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  };

  return (
      <div className="question-container">
          <div className="question-heading">
              <span className='question-h1'>My Questions</span>
              <button className='ask-question-btn' onClick={navAskQuestion}>Ask Question</button>
          </div>
          <div className="question-list">
              {userId && currentQuestions.map((question) => (
                  <div key={question._id} className="question" onClick={() => handleClick(question._id)}>
                      <div className="question-content">
                          <h3 className='q-title'>{question.title}</h3>
              
                          <p className='q-tags'>Tags: {question.tags.join(', ')}</p>

                      </div>
                  </div>
              ))}
              {!userId && (
                <div className="no-questions">Please log in to view your questions.</div>
              )}
          </div>
          <div className="pagination">
            <div className="prev">
              <GrFormPrevious className='page-icon' onClick={prevPage} disabled={currentPage === 1 || questions.length === 0} />
              <button onClick={prevPage} disabled={currentPage === 1 || questions.length === 0}>Previous</button>

            </div>
            <div className="next">
              <button className='next-btn' onClick={nextPage} disabled={currentPage === Math.ceil(questions.length / questionsPerPage) || questions.length === 0}>Next</button>
              <GrFormNext className='page-icon' onClick={nextPage} disabled={currentPage === Math.ceil(questions.length / questionsPerPage) || questions.length === 0} />

            </div>
          </div>
      </div>
  );
}

export default MyQuestions;
