import React,{ Fragment, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import '../css/SidebarUpdated.css';
import { MdHome } from "react-icons/md";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { TbUserQuestion } from "react-icons/tb";
// import '../css/Sidebar.css';

const Sidebar = ({ show }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleSetActiveLink = (link) => {
    navigate(link);
    setActiveLink(link);
  };

  // const navigate = useNavigate();

  // const navHome = () => {
  //   navigate('/');
  // };

  // const navQuestions = () => {
  //   navigate('/forum');
  // };

  // const navMyQuestions = () => {
  //   navigate('/forum1');
  // };

  return (
    <Fragment>
      <div className={`sidebar-container ${show ? 'show' : ''}`}>
          <ul className='side-links'>
            <div className={`home-option-con ${activeLink === '/' ? 'active' : ''}`} onClick={() => handleSetActiveLink('/')} >
              <MdHome className='sidebar-icon' />
              <NavLink to='/' ><li>Home</li></NavLink>

            </div>
            <div className={`questions-option-con ${activeLink === '/forum' ? 'active' : ''}`} onClick={() => handleSetActiveLink('/forum')} >
              <BsFillQuestionSquareFill className='sidebar-icon' />
              <NavLink to='/forum' ><li>Questions</li></NavLink>

            </div>
            <div className={`myq-option-con ${activeLink === '/forum1' ? 'active' : ''}`} onClick={() => handleSetActiveLink('/forum1')} >
              <TbUserQuestion className='sidebar-icon' />
              <NavLink to='/forum1' ><li>My Questions</li></NavLink>

            </div>
              {/* <NavLink exact to='/bookmarks' ><li>Bookmarks</li></NavLink> */}
          </ul>
      </div>
      

    </Fragment>

  )
}

export default Sidebar;