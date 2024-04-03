import React,{useState,useEffect} from 'react';
import axios from 'axios';
import '../css/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    // profilePicture: ''
  });



  const [error, setError] = useState('');

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: ['username','password'].includes(name) ? value.trim() : value
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
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
              console.error('Invalid email format.');
              return;
          }

          if (!/^.{1,16}$/.test(formData.password)) {
              console.error('Password must be between 1 and 16 characters.');
              return;
          }

          const response = await axios.post('http://localhost:8000/api/signup', formData);
          console.log(response.data);
          setFormData({
              username: '',
              email: '',
              password: '',
              firstName: '',
              lastName: ''
          });
          
      } catch (error) {
          // console.error('Signup Error:', error);
          if (error.response) {
              if (error.response.status === 400) {
                  if (error.response.data.error === "Email already exists." || error.response.data.error === "Username already exists.") {
                      
                      setError(error.response.data.error);
                  } else if (error.response.data.error === "Invalid email format.") {
                      
                      setError(error.response.data.error);
                  } else if (error.response.data.error === "Password must be between 1 and 16.") {
                      
                      setError(error.response.data.error);
                  }
              } else {
                  
                  console.error('Signup Error:', error);
                  setError("An error occurred. Please try again later.");
              }
          } else {
              console.error('Signup Error:', error);
              setError("An error occurred. Please check your network connection and try again.");
          }
      }
          
  };


  return (
      <div className="signup-container">
          <div className='signup-inner-container'>
              
                  
            <div className="title">
                <h3>Create an account</h3>

            </div>
                  
            <form onSubmit={handleSubmit} className='signup-inner-form'>
                
                <div className="contain">

                    <div className="name-container">
                        <input type="text" name="firstName" className='input-text-2' placeholder="First Name" value={formData.firstName} onChange={handleChange} autoComplete='off' required />
                        <input type="text" name="lastName" className='input-text-2' placeholder="Last Name" value={formData.lastName} onChange={handleChange} autoComplete='off' required />
                    </div>
                    {/* <div className="form-group form-box">
                    </div> */}
                    <div className="username">
                        <input type="text" name="username" className='input-text-3' placeholder="Username" value={formData.username} onChange={handleChange} autoComplete='off' required />
                    </div>
                    <div className="email">
                        <input type="email" name="email" className='input-text-3' placeholder="Email" value={formData.email} onChange={handleChange} autoComplete='off' required />
                    </div>
                    <div className="password">
                        <input type="password" name="password" className='input-text-3' placeholder="Password" value={formData.password} onChange={handleChange} autoComplete='off' required />
                        {error && <Error>{error}</Error>}
                    </div>
                    {/* <div className="form-group form-box">
                        <input type="text" name="profilePicture" className='input-text' placeholder="Profile Picture URL" value={formData.profilePicture} onChange={handleChange} />
                    </div> */}
                    <div className="btn-class-1">
                        <button className='primary-btn' type="submit">Sign up</button>
                    </div>
                </div>
                

            </form>

                  
              
          </div>

      </div>
  );
  }

  const Error = ({children}) => {
    return <div className="error-1">{children}</div>
  }

export default Signup;