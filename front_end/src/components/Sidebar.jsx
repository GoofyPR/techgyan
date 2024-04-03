import React,{Fragment} from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = ({ show }) => {
  return (
    <Fragment>
      <div className={`sidebar-container ${show ? 'show' : ''}`}>
          <ul className='side-links'>
              <NavLink to='/' ><li>Home</li></NavLink>
              <NavLink to='/forum' ><li>Questions</li></NavLink>
              <NavLink to='/forum1' ><li>My Questions</li></NavLink>
              {/* <NavLink exact to='/bookmarks' ><li>Bookmarks</li></NavLink> */}
          </ul>
      </div>
      <div className="empty"></div>

    </Fragment>

  )
}

export default Sidebar;