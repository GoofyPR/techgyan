import React,{ Fragment, useState } from 'react';
// import { jwtDecode } from 'jwt-decode';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Forum from './components/Forum';
// import MyQuestions from './components/MyQuestions';
import Bookmarks from './components/Bookmarks';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Signup from './components/Signup';
import AskQuestion from './components/AskQuestion';
import Forum1 from './components/Forum1';
import Settings from './components/Settings';
// import RemoveHeader from './components/RemoveHeader';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  // const [questions, setQuestions] = useState([]);

  const handleLogin = () => {
    
    setIsLoggedIn(true);
  };  

  
  // const token = localStorage.getItem('token');
  // const decodedToken = token ? jwtDecode(token) : null;
  // const userId = decodedToken ? decodedToken._id : null;
  

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // const handleQuestionSubmit = (newQuestion) => {
  //   setQuestions([newQuestion, ...questions]);
  // };


  return (
    <Router>
      <Fragment>
        
        <Header isLoggedIn={isLoggedIn} onToggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <div className={`App ${showSidebar ? 'sidebar-open' : 'sidebar-closed'}`}>
          {/* <div className={`content ${showSidebar ? 'sidebar-open' : 'sidebar-closed'}`}>

          </div> */}
          <Sidebar show={showSidebar} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login onLogin={handleLogin} />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/forum' element={<Forum searchQuery={searchQuery} />} />
            <Route path='/forum1' element={<Forum1 searchQuery={searchQuery} />} />
            <Route path='/askquestion' element={<AskQuestion />} />
            <Route path='/Bookmarks' element={<Bookmarks />} />
            <Route path='/Settings' element={<Settings />} />
            

          </Routes>
          <Profile />
        </div>

      </Fragment>

    </Router>
  );
}

export default App;
