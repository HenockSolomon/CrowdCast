import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../HeaderPublic';

export default function Userprofile() {
  const [username, setUsername] = useState('');
  const [postedEvents, setPostedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/userprofile', {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(userInfo => {
        setUsername(userInfo.username); // set the username state
        console.log(username); // log username to the console
        setPostedEvents(userInfo.postedEvents || []); // set the posted events state (or empty array if undefined)
        setAttendedEvents(userInfo.attendedEvents || []); // set the attended events state (or empty array if undefined)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/post')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(posts => {
        // Filter the posts based on the logged-in username
        const filteredPosts = posts.filter(post => post.author.username === username);
        setPostedEvents(filteredPosts);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [username]);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>This is {username}'s profile page.</h1>

        <div className="posted-events">
          <h2>Posted Events</h2>
          {postedEvents.length > 0 ? (
            postedEvents.map(event => (
              <Link key={event._id} to={`/post/${event._id}`}>
                <div>{event.title}</div>
              </Link>
            ))
          ) : (
            <p>No posted events</p>
          )}
        </div>

        <div className="attended-events">
          <h2>Attending Events</h2>
          {attendedEvents.length > 0 ? (
            attendedEvents.map(event => (
              <Link key={event._id} to={`/post/${event._id}`}>
                <div>{event.title}</div>
              </Link>
            ))
          ) : (
            <p>No attended events</p>
          )}
        </div>
      </div>
    </div>
  );
}
