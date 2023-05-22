import React from "react";
import Navbar from "../HeaderPublic";
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "./editorPage";
import 'react-quill/dist/quill.snow.css';


export default function CreatePost() {

    
    const [title,setTitle] = useState('');
    const [numberOfPeople,setNumberOfPeople] = useState('');
    const [postCode,setPostCode] = useState('');
    const [dateTime,setDateTime] = useState('');
    const [eventType,setEventType] = useState('');
    const [privetPublic,setPrivetPublic] = useState('');
    const [coverImg,setCoverImg] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [file, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(e){
       
        const data = new FormData();
        data.set('title', title);
        data.set('numberOfPeople', numberOfPeople);
        data.set('postCode', postCode);
        data.set('dateTime', dateTime);
        data.set('eventType', eventType);
        data.set('coverImg', coverImg);

        data.set('privetPublic', privetPublic);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', file[0]);
        e.preventDefault();
        const response = await fetch ('http://localhost:8000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
    });
    if (response.ok) {
      console.log('working')
      setRedirect(true);
    }
  }
        
  if (redirect) {
        return <Navigate to={'/'} />
      }









    return (
        <div>
             <Navbar />
            <h1>Create Post</h1>


        <form onSubmit={createNewPost} className="create-post-form">
            <input type="title"
                    placeholder={'Title'}
                    value={title}
                    onChange={e => setTitle(e.target.value)} 
                    className="input-field"/>
             <input type="number"
                    placeholder={'number of peoples'}
                    value={numberOfPeople} 
                    onChange={e => setNumberOfPeople(e.target.value)} 
                    className="input-field"/>
             <input type="text"
                    placeholder={'Post Code'}
                    value={postCode}
                    onChange={e => setPostCode(e.target.value)} 
                    className="input-field"/>
            <input type="datetime-local"
                    placeholder={'Date and Time'}
                    value={dateTime}
                    onChange={e => setDateTime(e.target.value)} 
                    className="input-field"/>
            <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="input-field"
                    >
                    <option value="">Select event type</option>
                    <option value="casual">Casual</option>
                    <option value="business casual">Business Casual</option>
                    <option value="costume">Costume</option>
                    <option value="black tie">Black Tie</option>
                    <option value="white tie">White Tie</option>
                    <option value="white tie">cocktail</option>
            </select>

            <select
                    value={privetPublic}
                    onChange={e => setPrivetPublic(e.target.value)}
                    className="input-field" >
                    <option value="">Select event for </option>
                    <option value="private">Close family/friends</option>
                    <option value="public">Public</option>
            </select>

           
            
            <input type="file"
                    onChange={ev => setFiles(ev.target.files)} 
                    className="input-field"/>
            <Editor value={summary}  onChange={setSummary} className="editor" />
            <button style={{marginTop:'5px'}} className="submit-btn">Create post</button>
        </form>

        </div>
    )
}