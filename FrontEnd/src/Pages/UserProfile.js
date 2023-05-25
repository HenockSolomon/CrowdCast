import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../HeaderPublic';

export default function Userprofile() {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [postedEvents, setPostedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);



//////////////////////////////////////////////////////////////////////for attended Events //////////////////////////////////////////////////////////////////
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

        console.log(userInfo);
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

//////////////////////////////////////////for already created posts////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchAttendingEvents = async () => {
      try {
        if (userInfo?.eventsAttending) {
          setAttendingEvents(userInfo.eventsAttending);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchAttendingEvents();
  }, [userInfo]);







  
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
              <Link key={event._id} to={`/post/${event._id}`}>
                <div>{event.title}</div></Link>
            ))
          ) : (
            <p>No attended events</p>
          )}
        </div>
      </div>
    </div>
  );
}
