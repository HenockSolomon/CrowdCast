import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../HeaderPublic';

export default function Userprofile() {
  const [username, setUsername] = useState('');
  const [postedEvents, setPostedEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [attendedEventTitles, setAttendedEventTitles] = useState([]);

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
        setUsername(userInfo.username);
        setPostedEvents(userInfo.postedEvents || []);
        setAttendedEvents(userInfo.attendedEvents || []);
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
        const filteredPosts = posts.filter(post => post.author.username === username);
        setPostedEvents(filteredPosts);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [username]);

  useEffect(() => {
    const fetchAttendedEventTitles = async () => {
      const attendedTitles = [];

      for (const event of attendedEvents) {
        try {
          const response = await fetch(`http://localhost:8000/post/${event._id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const post = await response.json();
          attendedTitles.push(post.title);
        } catch (error) {
          console.error(`Error fetching post ${event._id}:`, error);
        }
      }

      setAttendedEventTitles(attendedTitles);
    };

    fetchAttendedEventTitles();
  }, [attendedEvents]);

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
            <p>Hi {username}. You have no posted events
            </p>
           <Link to={'/'}><p>Please visit the <b> home page</b> to see any events you might be interested in :)</p>
            </Link> </>
          )}
        </div>

        <div className="attended-events">
          <h2>Attending Events</h2>
          {attendedEventTitles.length > 0 ? (
            attendedEventTitles.map((title, index) => (
              <div key={index}>{title}</div>
            ))
          ) : (
            <p>No attended events</p>
          )}
        </div>
      </div>
    </div>
  );
}
