import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "./Editor";
import Navbar from "../HeaderPublic";
export default function EditPost() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [numberOfPeople,setNumberOfPeople] = useState('');
    const [dateTime,setDateTime] = useState('');
    const [eventType,setEventType] = useState('');
    const [privetPublic,setPrivetPublic] = useState('');
    const [coverImg,setCoverImg] = useState('');
    const [postCode,setPostCode] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [file, setFiles] = useState('');

    const [redirect,setRedirect] = useState(false);

useEffect(()=>{
    fetch (`http//:localhost:8000/post/${id}`)
    .then((response)=>{
        response.json().then(postInfo => {
            setTitle(postInfo.title);
            setNumberOfPeople(postInfo.numberOfPeople);
            setDateTime(postInfo.dateTime);
            setEventType(postInfo.eventType);
            setPrivetPublic(postInfo.privetPublic);
            setCoverImg(postInfo.coverImg);
            setPostCode(postInfo.postCode);
            setSummary(postInfo.summary);
            setContent(postInfo.content);
            setFiles(postInfo.files);
        });
    });
}, []);

async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
        data.set('title', title);
        data.set('numberOfPeople', numberOfPeople);
        data.set('dateTime', dateTime);
        data.set('eventType', eventType);
        data.set('coverImg', coverImg);
        data.set('postCode', postCode);
        data.set('privetPublic', privetPublic);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (file?.[0]) {
            data.set('file', file?.[0]);
          }
          const response = await fetch('http://localhost:8000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
          });
          if (response.ok) {
            setRedirect(true);
          }
        }
      
        if (redirect) {
          return <Navigate to={'/post/'+id} />
        }




        return (
            <div>
                 <Navbar />
                <h1>Create Post</h1>
    
    
            <form onSubmit={updatePost} className="create-post-form">
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
                <input type="Date"
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
                        <option value="private">Private</option>
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