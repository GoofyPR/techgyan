import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AskQuestion.css';

import JoditEditor from 'jodit-react';
import axios from 'axios';
import DOMPurify from 'dompurify';

function AskQuestion() {
    const navigate = useNavigate();
    // const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    // const [tryFilled, setTryFilled] = useState(false);
    // const [detailsFilled, setDetailsFilled] = useState(false);
 
  
    const titleRef = useRef(null);
    const detailsRef = useRef(null);
    const tryRef = useRef(null);
    const tagRef = useRef(null);
    const questionFormRef = useRef(null);

    const editorConfig = {
        readonly:false,
        uploader: {
            insertImageAsBase64URI: true
        }
    };

//   const handleSignout = () => {
//     localStorage.removeItem('token');

//   };

    const token = localStorage.getItem('token');

    const navQuestions = () => {
        navigate('/forum');
    }

    const removeHtmlTags = (htmlString) => {
        return htmlString.replace(/<((?!img)[^>]+)>/ig, '');
    // return htmlString.replace(/(<([^>]+)>)/ig, '');
    // return htmlString.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
    }

  // const extractImagesFromBody = (body) => {
  //   const regex = /<img.*?src=['"](.*?)['"]/g;
  //   // let match;
  //   const images = [];
  //   const bodyWithoutImages = body.replace(regex, (match, capture) => {
  //     const base64Image = capture.split(",")[1];
  //     const fileTypeMatch = capture.match(/^data:(.*?);base64,/);
  //     const fileType = fileTypeMatch ? fileTypeMatch[1] : 'image/jpeg'; 
  //     images.push({
  //       fileName: '', // You can set a default value or leave it empty
  //       fileType: fileType,
  //       data: base64Image,
  //     });
  //     return `[IMAGE_PLACEHOLDER_${images.length - 1}]`;
  //   });
  
  //   console.log('Extracted images:', images);
  //   return { images, bodyWithoutImages };
  // };
  

    const extractImagesFromBody = (body) => {
        const regex = /<img.*?src=['"](.*?)['"]/g;
        let match;
        const images = [];
  
        while ((match = regex.exec(body))) {
            const base64Image = match[1].split(",")[1];
            const fileTypeMatch = match[1].match(/^data:(.*?);base64,/);
            const fileType = fileTypeMatch ? fileTypeMatch[1] : 'image/jpeg'; 
            images.push({
                fileName: '', 
                fileType: fileType,
                data: base64Image,
            });
        }
  
        console.log('Extracted images:', images);
        return images;
    };
  


  
  
    const removeImagesFromBody = (body) => {
    
        return body.replace(/<img.*?>/g, '');
    // return body.replace(/<img[^>]*>/g, '');
    };

  // const removeImagesFromBody = (body) => {
  //   return body.replace(/<img.*?>/g, (match, offset) => {
  //     return `[IMAGE_PLACEHOLDER_${offset}]`;
  //   });
  // };

    // const handleNext = (e) => {
    //     e.preventDefault();
 
    //     if (currentStep === 1 && title.trim() !== '') {
    //         setCurrentStep((prevStep) => prevStep + 1);
    //     } else if (currentStep === 2 && detailsFilled) {
    //         setCurrentStep((prevStep) => prevStep + 1);
    //     } else if (currentStep === 3 && tryFilled) {
    //         setCurrentStep((prevStep) => prevStep + 1);
    //     } else if (currentStep === 4 && tags.length > 0) {
    //         setCurrentStep((prevStep) => prevStep + 1);
    //     } else {
    //         alert('Please fill out the current step before proceeding.');
    //     }
  
    // };
  
    const handleSubmit = async(e) => {
        e.preventDefault();

    // const title = titleRef.current.value;
    // const detailsText = detailsRef.current.value;
    // const tryText = tryRef.current.value;
    // const body = `${detailsText}\n\n${tryText}`;
    // const tags = tagRef.current.value.split(',').map(tag => tag.trim());

    // const title = titleRef.current ? titleRef.current.value : '';

        if (!title) {
            alert('Please enter a title.');
            return;
        }
    
        const detailsText = detailsRef.current ? detailsRef.current.value : '';
        const tryText = tryRef.current ? tryRef.current.value : '';


        let body = `${detailsText}\n\n${tryText}`;
    

        const tags = tagRef.current ? tagRef.current.value.split(',').map(tag => tag.trim()) : [];
    



        if (!token) {
            alert('Please log in first.');
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data'
            },
            processData: false
        };

    // let formData = { title, body, tags };


    // let formData = { title, body, tags, images: [] };


        const images = extractImagesFromBody(body);
    // const { images, bodyWithoutImages } = extractImagesFromBody(body);
    // body = bodyWithoutImages;

    // images.forEach((image) => {
    //   // formData.append(`image${index}`, image);
    //   formData.images.push(image);
    // });
    
        body = removeImagesFromBody(body);
        body = removeHtmlTags(body);
        const sanitizedBody = DOMPurify.sanitize(body);
    // formData = { ...formData, body: sanitizedBody };
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', sanitizedBody);
        formData.append('tags', tags.join(','));

        if (Array.isArray(images)) {
            images.forEach((image, index) => {
                formData.append(`images[${index}][fileName]`, image.fileName);
                formData.append(`images[${index}][fileType]`, image.fileType);
                formData.append(`images[${index}][data]`, image.data);
            });
        } else {
            console.error('Images is not an array:', images);
        }
    
    // images.forEach((image, index) => {
    //   formData.append(`images[${index}][fileName]`, image.fileName);
    //   formData.append(`images[${index}][fileType]`, image.fileType);
    //   formData.append(`images[${index}][data]`, image.data);
    // });

    // formData.append('body',sanitizedBody);

        console.log('Images:', images);
        console.log('Santized body:', sanitizedBody); 
        
  

    // formData = { ...formData, images, body };
        console.log('Form Data:', formData);

        try {
            const response = await axios.post('http://localhost:8000/api/createq',formData,config);
            console.log('Question submitted:', response.data);

            // onQuestionSubmit(response.data);

            questionFormRef.current.reset();
            setTitle('');
            setTags([]);

            navigate('/forum');
            // formData.values.reset();
            // setCurrentStep(1);
            // onQuestionSubmit();
        } catch (error) {
            console.error('Error submitting question:', error);
        }
    };

    // const handleDetailsChange= (value) => {
    
    
    //     setDetailsFilled(value.trim() !== '');

   
    // };

    // const handletryChange= (value) => {
   
    
    //     setTryFilled(value.trim() !== '');

   
    // };


  // return body.replace(/<img.*?src=['"](.*?)['"].*?>/g, '');



    return(
    
        <form onSubmit={handleSubmit} encType="multipart/form-data" method='POST' ref={questionFormRef} className="ask-question-container">
            <div className="ask-question-heading">
                <span className='ask-question-h1'>Ask a Question...</span>
                <button className='questions-btn' onClick={navQuestions} >Questions</button>
            </div>
        
            <div className={`ask-question-title`}>
                <div className="title-heading">
                    <label htmlFor="title">Title</label>

                </div>
                
                <p className='title-para'>Be detailed and envision yourself asking someone a question.</p>
                <input type="text" id='title' placeholder='Ask your question...' className='input-text' ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} />
                
                {/* <div className="title-button">
                    <button className='next-btn' onClick={handleNext}>Next</button>
                </div> */}

            
            </div>

        
        
            <div className={`ask-question-details`}>
                <div className="details-heading">
                    <label htmlFor="detailsText">What are the details of your problem?</label>
                </div>

                <p className='details-para'>Introduce and elaborate on the problem you are facing.</p>
                <div className="jodit-editor-container">
                    <JoditEditor id='detailsText' ref={detailsRef} config={editorConfig} />
                {/* onChange={(value) => handleDetailsChange(value)} */}


                </div>
                
                {/* <div className="title-button">
                    <button className='next-btn' onClick={handleNext}>Next</button>
                </div> */}

            
            </div>

        
        
            <div className={`ask-question-try`}>
                <div className="try-heading">
                    <label htmlFor="tryText">What did you try and what were you expecting?</label>
                </div>

                <p className='try-para'>Describe what you tried, what you expected to happen, and the result of your attempt.</p>
                <div className="jodit-editor-container">
                    <JoditEditor id='tryText' ref={tryRef} config={editorConfig} />
                {/* onChange={(value) => handletryChange(value)} */}


                </div>
                
                {/* <div className="title-button">
                    <button className='next-btn' onClick={handleNext}>Next</button>
                </div> */}

                
            </div>

        
        
            <div className={`ask-question-tags`}>
                <div className="tags-heading">
                    <label htmlFor="tags">Tags</label>
                </div>

                <p className='tags-para'>Add tags to describe your question.</p>
                <input type="text" id='tags' placeholder='Add tags...' className='input-text' ref={tagRef} value={tags} onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))} />
                
                <div className="title-button">
                    <button className='submit-btn' type='submit'>Submit</button>
                </div>
                    
            
                

            </div>

        
            
        </form>
      
    
  

    );
}
export default AskQuestion;