import React, { useEffect, useState } from "react";
import Post from "../posts";
import HomePage from "../HomePage";
import '../App.css';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/post")
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>; // Display a loading state while fetching data
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Display an error message if there's an error
  }

  return (
    <div >
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </div>
  );
}
