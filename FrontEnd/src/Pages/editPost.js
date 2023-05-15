import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../HeaderPublic";

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
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
        setPost(postData);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        // Handle the error or redirect to an error page
      });
  }, [id]);

  const handleUpdatePost = async (ev) => {
    ev.preventDefault();
    // Perform the update request using the updated post data
    try {
      const response = await fetch(`http://localhost:8000/post/${id}`, {
        method: "PUT",
        // Include the updated post data in the request body
        // For example: body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle the error or show an error message to the user
    }
  };

  if (!post) {
    return <div>Loading...</div>; // Show a loading indicator instead of an empty string
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <>
      <Navbar />
      <div className="edit-post-page">
        <h1>Edit Post</h1>
  
        <form onSubmit={handleUpdatePost} className="edit-post-form">
          {/* Render input fields for editing the post */}
          <input
            type="text"
            placeholder="Title"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="input-field"
          />
  
          <textarea
            placeholder="Summary"
            value={post.summary}
            onChange={(e) => setPost({ ...post, summary: e.target.value })}
            className="input-field"
          />
  
          <textarea
            placeholder="Content"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="input-field"
          />
  
          {/* Add more input fields for other post properties as needed */}
  
          <button type="submit" className="submit-btn">
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}