import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../HeaderPublic';

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
            const attendingEventsData = [];
      
            for (const eventId of attendingEventIds) {
              const response = await fetch(`http://localhost:8000/post/${eventId}/`, {
                method: 'PUT',
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
      
            // Ensure the correct property name is used for the postId
            const attendingEventsWithId = attendingEventsData.map(event => ({
              postId: event._id, // Replace `_id` with the correct property name
              title: event.title // Replace `title` with the correct property name
            }));
      
            setAttendingEvents(attendingEventsWithId);
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
      <div className="container">
        <h1>This is {username}'s profile page.</h1>

        <div className="posted-events">
          <h2>Here are your Posted Events:</h2>
          {postedEvents.length > 0 ? (
            postedEvents.map(event => (
              <Link key={event._id} to={`/post/${event._id}`}>
                <div>{event.title}</div>
              </Link>
            ))
          ) : (
            <>
              <p>Hi {username}. You have no posted events.</p>
              <Link to={'/'}>
                <p>
                  Please visit the <b>home page</b> to see any events you might be interested in :)
                </p>
              </Link>
            </>
          )}
        </div>

        <div className="attended-events">
          <h2>Attending Events</h2>
          {attendingEvents.length > 0 ? (
            attendingEvents.map(event => (
              <div key={event.postId}>
                <Link to={`/post/${event.postId}`}>
                  <div>{event.title}</div>
                </Link>
                <button onClick={() => handleCancelEvent(event.postId)}>Cancel Event</button>
              </div>
            ))
          ) : (
            <p>No attended events</p>
          )}
        </div>
      </div>
    </div>
  );
}
