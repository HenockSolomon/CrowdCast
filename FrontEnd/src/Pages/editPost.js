import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../HeaderPublic";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [postCode, setPostCode] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [summary, setSummary] = useState("");
  const [eventType, setEventType] = useState("");
  const [privatePublic, setPrivatePublic] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        return response.json();
      })
      .then((postData) => {
        setTitle(postData.title);
        setPostCode(postData.postCode);
        setNumberOfPeople(postData.numberOfPeople);
        setDateTime(postData.dateTime);
        setSummary(postData.summary);
        setEventType(postData.eventType);
        setPrivatePublic(postData);
        setCoverImg(postData.coverImg);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        // Handle the error or redirect to an error page
      });
  }, [id]);

  const handleUpdatePost = async (ev) => {
    ev.preventDefault();
    try {
      
      const response = await fetch(`http://localhost:8000/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, postCode, numberOfPeople, dateTime,eventType,privatePublic, coverImg, summary}),
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle the error or show a notification to the user
    }
  };

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <>
      <Navbar />
      <div className="edit-post-page">
        <h1></h1>
        <div className="edit-post-page-form">
        <form onSubmit={handleUpdatePost} className="edit-post-form">
          <label htmlFor="title">Title: </label><br/>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          /><br/>

          <label htmlFor="postCode">Post Code:</label><br/>
          <input
            type="text"
            id="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            className="input-field"
          /> <br/>
           <label htmlFor="numberOfPeople">Number of People:</label><br/>
          <input
            type="number"
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            className="input-field"
          /><br/>
          <label htmlFor="dateTime">Date and Time:</label><br/>
          <input
            type="datetime-local"
            id="dateTime"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="input-field"
          /><br/>
      <label htmlFor="privatePublic">Event is for:</label><br/>
      <select
        id="privatePublic"
        value={privatePublic}
        onChange={(e) => setPrivatePublic(e.target.value)}
        className="input-field"
      >
       
      
                    <option value="family/friends">For close family/friends</option>
                    <option value="co-workers">For co-workers</option>
                    <option value="charity">For charity</option>
                    <option value="social">For public social gathering</option>
                    <option value="conference">For conference</option>
                    <option value="workshop">For workshop</option>
                    <option value="exhibition">For exhibition</option>
                    <option value="concert">For concert</option>
                    <option value="sport">For sport event</option>
      </select><br/>

      <label htmlFor="eventType">Event Type:</label><br/>
      <select
        id="eventType"
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        className="input-field"
      >
        
            <option value="casual">Casual</option>
            <option value="business casual">Business Casual</option>
            <option value="costume">Costume</option>
            <option value="black tie">Black Tie</option>
            <option value="white tie">White Tie</option>
            <option value="cocktail">cocktail</option>
      </select>   <br/>
   

          <label htmlFor="summary">Summary:</label><br/>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="input-field"
            /><br/>

          <button type="submit" className="submit-btn">
            Update Post
          </button>
        </form>
        </div>
      </div>
    </>
  );
}
