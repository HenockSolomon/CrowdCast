import React, { useState, useEffect } from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Navbar from "./HeaderPublic";
import PropTypes from "prop-types";

export default function Post({ _id, title, numberOfPeople, dateTime, eventType, privetPublic, postCode, coverImg, createdAt, summary, author }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (author && author.username) {
      setUsername(author.username);
    }
  }, [author]);

  return (
    <div>
     
      <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={`http://localhost:8000/${coverImg}`} alt={title} />
          </Link>
        </div>
        <div className="texts">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <p className="info">
            <a className="author">{author && author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          Location is at: {postCode}, it is a {eventType} {privetPublic} event <br/>
          Date of the event : {dateTime}, for {numberOfPeople} people , 
          {summary && (
            <article className="summary">
              {summary}
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
