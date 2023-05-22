import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../Props/UserInfo";
import Navbar from "../HeaderPublic";
import axios from "axios";
import Post from "../posts"
export default function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [editable, setEditable] = useState(false);
  const [username, setUsername] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/post/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch post");
          }
          return response.json();
        })
        .then((postData) => {
          setPost(postData);
          if (postData.author.username === username) {
            setEditable(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching post:", error);
          // Handle the error or redirect to an error page
        });
    }
  }, [id, username]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://localhost:8000/userprofile', {
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const { username } = await response.json();
        setUsername(username);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    fetchUsername();
  }, []);

  if (!post) {
    return <div>Loading...</div>; // Show a loading indicator instead of an empty string
  }



  const handleDeleteClick = () => {
  
    setShowDeleteModal(true);
  };


  const handleConfirmDelete = async (_id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/post/${_id}`, {
        method: "DELETE"
      });
      const result = response.data;
  
      if (result) {
        console.log('Post deleted successfully');
      }
  
      const newPost = post.filter((post) => post._id !== _id);
      setPost(newPost);
      // Redirect to the home page or any other desired location
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting post:', error);
     
      console.log(error);
      window.location.href = '/';
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="post-page cont">
        <h1>{post.title}</h1>
        <time>{formatISO9075(new Date(post.createdAt))}</time>
        <div className="author">by @{post.author.username}</div>
      
        
       
        <div className="image">
          <img src={`http://localhost:8000/${post.coverImg}`} alt={post.title} />
        </div>
        <div>
          Location is at: {post.postCode}, it is a {post.eventType} {post.privetPublic} event
        </div>
        <div>
          Date of the event: {post.dateTime}, for {post.numberOfPeople} people
        </div>
        <div className="content" dangerouslySetInnerHTML={{ __html: post.summary }} />
        {editable && (
          <div className="edit-row">
            <Link className="edit-btn" to={`/edit/${post._id}`}> 
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-4 h-4"
                width="25"
                height="14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
             Edit this post</button>
            </Link><br/>
     
        
        
          <button type="button" onClick={handleDeleteClick}>
            Delete this post
          </button>
          {showDeleteModal && (
          <div className="delete-modal">
            <p>Are you sure you want to delete this post?</p>
            <button type="button" onClick={() => handleConfirmDelete(post._id)}>
              Confirm Delete
            </button> <br/>
            <button type="button" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        )}
        </div>
        )}
      </div>
      
    </>
  );
        }  