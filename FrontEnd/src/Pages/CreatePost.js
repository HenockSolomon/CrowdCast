import React from "react";
import Navbar from "../HeaderPublic";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./editorPage";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [postCode, setPostCode] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [privatePublic, setPrivatePublic] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('numberOfPeople', numberOfPeople);
    data.set('postCode', postCode);
    data.set('dateTime', dateTime);
    data.set('eventType', eventType);
    data.set('coverImg', coverImg);
    data.set('privatePublic', privatePublic);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', file[0]);

    const response = await fetch('http://localhost:8000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Working');
      setRedirect(true);
    }
  }

  function cancelCreatePost() {
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div>
      <Navbar />

      <div className="create-post-cont">
        <h1 className="display-4">Here you can create your events</h1>
        <form onSubmit={createNewPost} className="create-post-form">
          <input
            type="title"
            placeholder={'Title'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input-field"
          />

          <input
            type="text"
            placeholder={'Post Code'}
            value={postCode}
            onChange={e => setPostCode(e.target.value)}
            className="input-field "
          />

          <select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className="input-field select"
          >
            <option value="">Select event type</option>
            <option value="casual">Casual</option>
            <option value="business casual">Business Casual</option>
            <option value="costume">Costume</option>
            <option value="black tie">Black Tie</option>
            <option value="white tie">White Tie</option>
            <option value="cocktail">Cocktail</option>
          </select>

          <select
            value={privatePublic}
            onChange={e => setPrivatePublic(e.target.value)}
            className="input-field select"
          >
            <option value="">Select event for</option>
            <option value="family/friends">For close family/friends</option>
            <option value="co-workers">For co-workers</option>
            <option value="charity">For charity</option>
            <option value="social">For public social gathering</option>
            <option value="conference">For conference</option>
            <option value="workshop">For workshop</option>
            <option value="exhibition">For exhibition</option>
            <option value="concert">For concert</option>
            <option value="sport">For sport event</option>
          </select>

          <div className="datetime-nums">
            <input
              type="number"
              placeholder={'number of peoples'}
              value={numberOfPeople}
              onChange={e => setNumberOfPeople(e.target.value)}
              className="input-field nums"
            />
            <input
              type="datetime-local"
              placeholder={'Date and Time'}
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="input-field datetime"
            />
          </div>
          <input
            type="file"
            onChange={ev => setFiles(ev.target.files)}
            className="input-field"
          />
          <Editor value={summary} onChange={setSummary} className="editor" />
          <button style={{ marginTop: '5px' }} className="submit-btn btn">Create Event</button>
          <button style={{ marginTop: '5px' }} className="submit-btn btn" onClick={cancelCreatePost}>Cancel</button>
        </form>
      </div>
    </div>
  );
}
