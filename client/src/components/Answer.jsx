import React, {useRef} from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import JoditEditor from 'jodit-react';
import '../css/Answers.css';


function Answer({ questionId, onAnswerSubmit }) {
    // const [body, setBody] = useState('');
    // const [file, setFile] = useState(null);
    const bodyRef = useRef(null);

    const editorConfig = 
      {
        readonly:false,
        uploader: {
          insertImageAsBase64URI: true
        },
        placeholder: 'Write your answer here...',
        theme: "light",
        
        

      }
      
        
        
 

    const removeHtmlTags = (htmlString) => {
        return htmlString.replace(/<((?!img)[^>]+)>/ig, '');
        // return htmlString.replace(/(<([^>]+)>)/ig, '');
        // return htmlString.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, '');
    }

    const extractImagesFromBody = (body) => {
        const regex = /<img.*?src=['"](.*?)['"]/g;
        let match;
        const images = [];
      
        while ((match = regex.exec(body))) {
          const base64Image = match[1].split(",")[1];
          const fileTypeMatch = match[1].match(/^data:(.*?);base64,/);
          const fileType = fileTypeMatch ? fileTypeMatch[1] : 'image/jpeg'; 
          images.push({
            fileName: '', // You can set a default value or leave it empty
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
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
          alert('Please log in first.');
          return;
        }
    
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data'
          }
        };

        let body = bodyRef.current ? bodyRef.current.value : '';
        const images = extractImagesFromBody(body);
        body = removeImagesFromBody(body);
        body = removeHtmlTags(body);
        const sanitizedBody = DOMPurify.sanitize(body);

        // const bodyContent = bodyRef.current ? bodyRef.current.value : '';
        // const images = extractImagesFromBody(bodyContent);
        // let bodyText = removeImagesFromBody(bodyContent);
        // bodyText = removeHtmlTags(bodyText);
        // const sanitizedBody = DOMPurify.sanitize(bodyText);

        const formData = new FormData();
        formData.append('body', sanitizedBody);

        images.forEach((image, index) => {
            formData.append(`images[${index}][fileName]`, image.fileName);
            formData.append(`images[${index}][fileType]`, image.fileType);
            formData.append(`images[${index}][data]`, image.data);
          });
        // if (file) {
        //     formData.append('images', file);
        // }

        try {
            const response = await axios.post(`http://localhost:8000/api/createa/${questionId}`, formData, config);
            console.log('Answer submitted:', response.data);
            // Reset form fields after submission
            // setBody('');
            // setFile(null);
            onAnswerSubmit(response.data);
            bodyRef.current.value = '';
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    return (
        
        <form className='answer-box' onSubmit={handleSubmit}>
            <h3>Your Answer</h3>

            <div className="jodit-editor-container">
              <JoditEditor id='body' className='jodit-editor' ref={bodyRef} config={editorConfig} />

            </div>

            
            
            <div className="answer-button">
                <button className='answer-btn' type="submit">Submit</button>

            </div>
        </form>
        
    );
}

export default Answer;