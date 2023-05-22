import React, { useState, useEffect } from 'react';
import { formatISO9075, isAfter, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MAX_SUMMARY_LENGTH = 150; // Maximum characters for the summary

export default function Post({
  _id,
  title,
  numberOfPeople,
  dateTime,
  eventType,
  privetPublic,
  postCode,
  coverImg,
  createdAt,
  attending: initialAttending,
  attendeeCount: initialAttendeeCount,
  summary,
  author,
}) {
  const [username, setUsername] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isAttending, setIsAttending] = useState(initialAttending);
  const [attendeeCount, setAttendeeCount] = useState(initialAttendeeCount);

  const [attendedPostIds, setAttendedPostIds] = useState([]);

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
        if (userInfo && userInfo.username) {
          setUsername(userInfo.username);
          setIsAttending(initialAttending);
          setAttendeeCount(initialAttendeeCount);
          console.log(userInfo);
        } else {
          throw new Error('User info not available');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
  
    fetchUserProfile();
  }, [username, initialAttending, initialAttendeeCount]);

  const toggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };

  const toggleAttending = () => {
    if (!username) {
      alert('Please log in to attend the event.');
      return;
    }

    const newIsAttending = !isAttending;
    const newAttendeeCount = attendeeCount + (newIsAttending ? 1 : -1);

    // Update local state
    setIsAttending(newIsAttending);
    setAttendeeCount(newAttendeeCount);
    setAttendedPostIds(prevIds => {
      if (newIsAttending) {
        return [...prevIds, _id]; // Add the post ID
      } else {
        return prevIds.filter(id => id !== _id); // Remove the post ID
      }
    });

    // Send PUT request to update attendee count on the backend
    fetch(`http://localhost:8000/post/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: newIsAttending, attendeeCount: newAttendeeCount }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update attendee count');
        }
        return response.json();
      })
      .then(updatedPost => {
        // Handle the updated post response if needed
      })
      .catch(error => {
        console.error('Error updating attendee count:', error);
      });
  };

  const displaySummary =
    summary.length <= MAX_SUMMARY_LENGTH || showFullSummary
      ? summary
      : `${summary.substring(0, MAX_SUMMARY_LENGTH)}...`;

  const isEventFull = attendeeCount >= parseInt(numberOfPeople);

  const currentDate = new Date();
  const eventDate = new Date(dateTime);
  const isEventExpired = isAfter(currentDate, subDays(eventDate, 1));

  if (isEventExpired) {
    return null; // Skip rendering the post if it has already passed
  }

  return (
    <div className="post-container">
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
            <a className="author">by: @{author && author.username}    </a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          Location is at: {postCode}, it is a {eventType} {privetPublic} event
          <br />
          Date of the event: {dateTime}, for {numberOfPeople} people,{' '}
          {displaySummary && (
            <>
              <div
                className="summary"
                dangerouslySetInnerHTML={{ __html: displaySummary }}
              ></div>
              {summary.length > MAX_SUMMARY_LENGTH && (
                <div className="read-more" onClick={toggleSummary}>
                  {showFullSummary ? 'Read Less' : 'Read More'}
                </div>
              )}
            </>
          )}
          <div>
            {username ? (
              <>
                <button
                  className={`attending-btn${isAttending ? ' active' : ''}`}
                  onClick={toggleAttending}
                  disabled={isEventFull}
                >
                  {isEventFull ? 'Event Full' : isAttending ? 'Attending' : 'Attend'}
                </button>
                <span className="attendee-count">{attendeeCount}</span>
              </>
            ) : (
              <button>
                <Link  to={`/loginsignup`} >Log in to attend this event.</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  numberOfPeople: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  eventType: PropTypes.string.isRequired,
  privetPublic: PropTypes.string.isRequired,
  postCode: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  attending: PropTypes.bool.isRequired,
  attendeeCount: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string,
  }),
};
