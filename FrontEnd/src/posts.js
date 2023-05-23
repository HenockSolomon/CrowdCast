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
  privatePublic,
  postCode,
  coverImg,
  createdAt,
  attendingUsers,
  summary,
  author,
  attendeeCount: initialAttendeeCount,
}) {
  const [username, setUsername] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(initialAttendeeCount);

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
          setIsAttending(attendingUsers.includes(userInfo._id));
        } else {
          throw new Error('User info not available');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchUserProfile();
  }, [attendingUsers]);

  const toggleAttending = async () => {
    if (!username) {
      alert('Please log in to attend the event.');
      return;
    }

    const newIsAttending = !isAttending;

    // Update local state
    setIsAttending(newIsAttending);

    // Update attendee count
    setAttendeeCount(prevCount => prevCount + (newIsAttending ? 1 : -1));

    // Send API request to update attendee count on the server
    try {
      const response = await fetch(`http://localhost:8000/post/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: newIsAttending }),
      });

      if (!response.ok) {
        throw new Error('Failed to update attendee count.');
      }
      if (newIsAttending) {
        const userResponse = await fetch('http://localhost:8000/userprofile/eventsAttending', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postID: _id, title }),
        });
  
        if (!userResponse.ok) {
          throw new Error('Failed to update user eventsAttending.');
        }
      }
    } catch (error) {
      console.error('There was a problem with the API request:', error);
    }
  };

  const toggleSummary = () => {
    setShowFullSummary(!showFullSummary);
  };

  const displaySummary =
    summary.length <= MAX_SUMMARY_LENGTH || showFullSummary
      ? summary
      : `${summary.substring(0, MAX_SUMMARY_LENGTH)}...`;

  const currentDate = new Date();
  const eventDate = new Date(dateTime);
  const isEventExpired = isAfter(currentDate, subDays(eventDate, 1));

  if (isEventExpired) {
    return null; // Skip rendering the post if it has already passed
  }

  const isEventFull = attendeeCount >= parseInt(numberOfPeople);

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
            <a className="author">by: @{author && author.username} </a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          Location is at: {postCode}, it is a {eventType} {privatePublic} event
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
                <span className="attendee-count">
                  {attendeeCount} {attendeeCount === 1 ? 'person is' : 'people are'} going
                </span>
              </>
            ) : (
              <button>
                <Link to={`/loginsignup`}>Log in to attend this event.</Link>
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
  privatePublic: PropTypes.string.isRequired,
  postCode: PropTypes.string.isRequired,
  coverImg: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  attendingUsers: PropTypes.array.isRequired,
  summary: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string,
  }),
  attendeeCount: PropTypes.number.isRequired,
};