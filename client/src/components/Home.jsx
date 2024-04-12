import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const calculateTimeAgo = (createdAt) => {
  const currentDate = new Date();
  const questionDate = new Date(createdAt);
  const diffInMilliseconds = currentDate - questionDate;
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  let timeAgo = '';
  if (years > 0) {
    timeAgo = `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    timeAgo = `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    timeAgo = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  return timeAgo;
};

const Home = () => {
  const [questionStats, setQuestionStats] = useState(0);
  const [answerStats, setAnswerStats] = useState(0);
  const [userData,setUserData] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentAnswers, setRecentAnswers] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);

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

  useEffect(()=>{
    const fetchUserStats = async()=>{
      const token = localStorage.getItem('token');
      // if(token){
      //   const decodedToken = jwtDecode(token);
        
      //   setUserData(decodedToken);
        
      // }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      try {
        
        const response = await axios.get('http://localhost:8000/api/stats',config);
        
        
        const { questionCount, answerCount } = response.data;
        // console.log('question count:', questionCount);
        // console.log('answer count:', answerCount);
        setQuestionStats(questionCount);
        setAnswerStats(answerCount);
        
        // console.log(response.data.stats);
        // setQuestionStats(response.data.questionCount);
        // setAnswerStats(response.data.answerCount);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  },[]);


  useEffect(() => {
    const fetchRecentQuestions = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('token not found.');
        }
        const decodedToken = token ? jwtDecode(token) : null;
        const userId = decodedToken ? decodedToken._id : null;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
          const [questionsResponse, answersResponse, userResponse] = await Promise.all([
            axios.get(`http://localhost:8000/api/recentq/${userId}`, config),
            axios.get(`http://localhost:8000/api/recenta/${userId}`, config),
            axios.get(`http://localhost:8000/api/userinfo/${userId}`,config) 
          ]);
          setRecentQuestions(questionsResponse.data);
          setRecentAnswers(answersResponse.data);
          setUserData(userResponse.data);
            // const response = await axios.get(`http://localhost:8000/api/recentq/${userId}`, config);
            // setRecentQuestions(response.data);
        } catch (error) {
            console.error("Error fetching recent questions:", error);
        }
    };

    // if (userData) {
    // }
    fetchRecentQuestions();
  }, [userData]);

  return (
    <div className='home-container' style={{ height: `${dynamicHeight}px` }} >
      <div className="welcome-container">
        {userData ? (
          <>
            <div className="welcome1"><span className='welcome-text'>Welcome,</span> {userData.firstName} {userData.lastName} </div>
          </>

        ) : (
          <>
            <div className="welcome1">Welcome, </div>
          </>
        )}

      </div>
      <div className="stats1">
        <div className="question-stats">
          <div className="con1">
            {questionStats} 

          </div>
          <span className='span'>Questions</span>
          <span className='question-span'>asked by you</span>
        </div>
        <div className="answer-stats">
          <div className="con2">
            {answerStats} 

          </div>
          <span className='span'>Answers</span>

          
          <span className='question-span'>given by you</span>
        </div>
        {/* <div className="bookmark-stats"></div> */}
      </div>
      <div className="stats2">
        <div className="recent-questions">
          <span className='recentq-title'>Recent questions asked by you</span>
          <div className="recentq-con">
            {recentQuestions.map(question => (
              <div key={question._id} className="question-card">
                <span className='span-color'>{question.title}</span>
                <span>{calculateTimeAgo(question.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="recent-answers">
          <span className='recenta-title'>Recent answers given by you</span>
          <div className="recenta-con">
            {recentAnswers.map(answer => (
              <div key={answer._id} className="answer-card">
                <span className='span-color'>{answer.body}</span>
                <span>{calculateTimeAgo(answer.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;