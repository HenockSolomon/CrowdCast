import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import Navbar from "./HeaderPublic";
import PropTypes from "prop-types";

export default function Post({
  _id,
  title,
  coverImg,
  createdAt,
  summary,
  author
}) {
  return (
    <div>
      <Navbar />
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
            <a className="author">{author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired
  }).isRequired
};
