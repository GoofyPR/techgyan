import React,{useState,useEffect} from 'react';
import axios from 'axios';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
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
  
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  

  const [error, setError] = useState('');

  const handleChange = (e) => {
      const {name,value} = e.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

  useEffect(() => {
      if(error){
          const timeoutID = setTimeout(() => {
              setError('');
          },3000);

          return () => clearTimeout(timeoutID);
      }
  }, [error]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:8000/api/signin',formData);
          localStorage.setItem('token', response.data.token);
          console.log(response.data);
          setFormData({
              emailOrUsername: '',
              password: ''
          });
          onLogin();
          navigate('/');
          window.location.reload(false);


      } catch (error) {
          if(error.response) {
              if(error.response.status === 400) {
                  if (error.response.data.error === "User not found." ) {
                      
                      setError(error.response.data.error);
                  } else if (error.response.data.error === "Invalid password.") {
                      
                      setError(error.response.data.error);
                  }

                  
              } else {
                  console.error('Signin Error',error);
                  setError("An error occurred. Please try again later.");
              }
          } else {
              console.error('Signin Error:', error);
              setError("An error occurred. Please check your network connection and try again.");
          }
      }
  };

  return(
      <div className="login-container" style={{ height: `${dynamicHeight}px` }} >
          <div className='signin-container'>
              
                  
            <div className="title-1">
                <h3>Sign in to your account</h3>

            </div>
                
            <form onSubmit={handleSubmit} className='signin-inner-form'>
                

                    
                <div className="email-username">
                    <input type="text" name="emailOrUsername" className='input-text-1' placeholder="Username or Email" value={formData.emailOrUsername} onChange={handleChange} autoComplete='off' required />
                </div>
                
                <div className="password">
                    <input type="password" name="password" className='input-text-1' placeholder="Password" value={formData.password} onChange={handleChange} autoComplete='off' required />
                    {error && <Error>{error}</Error>}
                </div>
                
                <div className="btn-class">
                    <button className='primary-btn-1' type="submit">Log in</button>
                </div>
                

            </form>

                  
              
          </div>

      </div>



  );
}

const Error = ({children}) => {
  return <div className="error">{children}</div>
};


export default Login;