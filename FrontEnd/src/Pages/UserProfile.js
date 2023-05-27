import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../HeaderPublic';
import axios from 'axios';
export default function Userprofile() {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [postedEvents, setPostedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/userprofile', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const userInfo = await response.json();
        setUsername(userInfo.username);
        setTitle(userInfo.title);
        setPostedEvents(userInfo.postedEvents || []);
        setUserInfo(userInfo);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (username) {
          const response = await fetch('http://localhost:8000/post');

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const posts = await response.json();
          const filteredPosts = posts.filter(post => post.author.username === username);
          setPostedEvents(filteredPosts);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      try {
        if (userInfo?.eventsAttending) {
          const attendingEventIds = userInfo.eventsAttending.map(event => event._id);
          const updatedAttendingEventsData = [];
  
          for (const eventId of attendingEventIds) {
            const response = await axios.get(`http://localhost:8000/post/${eventId}/${userInfo.id}`);
            
            if (response.status !== 200) {
              throw new Error('Failed to fetch attending event data');
            }
            const eventData = response.data
         
           const updatedAttendingEventsData = eventData.map(event=> ({
            postId: event._id, // Replace `_id` with the correct property name
            postTitle: event.title // Replace `title` with the correct property name
          }));

            
  
           console.log(updatedAttendingEventsData, '')
          setAttendingEvents(updatedAttendingEventsData);
          }
          console.log(updatedAttendingEventsData, '1')
          
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    fetchAttendingEvents();
  }, [userInfo]);
  
  
  

  const handleCancelEvent = async (eventId) => {
    try {
      if (userInfo?.eventsAttending) {
        const attendingEventIds = userInfo.eventsAttending.map(event => event._id);
        const attendingEventsData = [];

      for (const eventId of attendingEventIds) {
        const response = await fetch(`http://localhost:8000/post/${eventId}/${userInfo.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const attendingEventData = await response.json();
        attendingEventsData.push(attendingEventData);
      }


      setAttendingEvents(prevState => prevState.filter(event => event.postId !== eventId));
    } }catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

 return (
  <div>
    <Navbar />
    <div className="container-userprofile">
      <h1></h1>

      <div className="posted-events ">
        <h1 className='display-5'>Here are event you created </h1>
        {/* Event Created section */}
        {postedEvents.length > 0 ? (
          postedEvents.map(event => (
            <Link key={event._id} to={`/post/${event._id}`}>
              <div>{event.title}</div>
            </Link>
          ))
        ) : (
          <>
            <p>Hi {username}. You have no posted events.</p>
            <Link to="/">
              <p>
                Please visit the <b>home page</b> to see any events you might be interested in :)
              </p>
            </Link>
          </>
        )}
      </div>
      
            <div className="attended-events">
        <h1 className='display-5'>Here are you attending events</h1>
     
        {attendingEvents.length > 0 ? (
          attendingEvents.map(event => (<div className='attending-posts-cont'>
            <div key={event.postId} className='attending-posts'>
              <Link key={event._id} to={`/post/${event._id}`}>
              <div className='attending-post-title'>{event.postTitle}</div>
            </Link><button onClick={() => handleCancelEvent(event.postId)} className='btn cancle-event'>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
</svg> Cancel </button>
            </div>
         </div> ))
        ) : (
          <p>No attended events</p>
        )}
      </div>
    </div>
  </div>
);

}
