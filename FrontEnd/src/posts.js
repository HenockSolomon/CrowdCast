import React, { useState, useEffect } from 'react';
import { formatISO9075, isAfter, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// const MAX_SUMMARY_LENGTH = 30; // Maximum characters for the summary

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
  // summary,
  author,
}) {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  // const [showFullSummary, setShowFullSummary] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

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
        setUserInfo(userInfo);

        if (userInfo && userInfo.username) {
          setUsername(userInfo.username);
          setIsAttending(attendingUsers.some((user) => user.userId === userInfo._id));
        } else {
          setUsername('');
          setIsAttending(false);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchUserProfile();
  }, [attendingUsers]);

  const cancleAttendEvent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/post/${_id}/${userInfo.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel attendance.');
      }

      const profileResponse = await fetch('http://localhost:8000/userprofile', {
        credentials: 'include',
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile data');
      }

      const updatedUserInfo = await profileResponse.json();
      setUserInfo(updatedUserInfo);
      setIsAttending(updatedUserInfo.attendingEvents.some((event) => event._id === _id));
    } catch (error) {
      console.error('There was a problem with the API request:', error);
    }
  };

  const toggleAttending = async () => {
    if (!username) {
      alert('Please log in to attend the event.');
      return;
    }

    if (isAttending) {
      cancleAttendEvent();
    } else {
      try {
        const response = await fetch(`http://localhost:8000/post/${_id}/${userInfo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ attending: true }),
        });

        if (!response.ok) {
          throw new Error('Failed to update attendee count.');
        }

        const profileResponse = await fetch('http://localhost:8000/userprofile', {
          credentials: 'include',
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile data');
        }

        const updatedUserInfo = await profileResponse.json();
        setUserInfo(updatedUserInfo);
        setIsAttending(updatedUserInfo.attendingEvents.some((event) => event._id === _id));
      } catch (error) {
        console.error('There was a problem with the API request:', error);
      }
    }
  };

  // const toggleSummary = () => {
  //   setShowFullSummary(!showFullSummary);
  // };

  // const displaySummary =
  //   summary.length <= MAX_SUMMARY_LENGTH || showFullSummary
  //     ? summary
  //     : `${summary.substring(0, MAX_SUMMARY_LENGTH)}...`;

  const currentDate = new Date();
  const eventDate = new Date(dateTime);
  const isEventExpired = isAfter(currentDate, subDays(eventDate, 1));

  if (isEventExpired) {
    return null; // Skip rendering the post if it has already passed
  }

  return (
    <div className="CardGroup entire col-md-5">
      <div className="card">
        <img className="card-img-top custom-card-image " src={`http://localhost:8000/${coverImg}`} alt={title} />
        <div className="card-body">
          <h2 className="card-title">
            <Link to={`/post/${_id}`}>{title}</Link>
          </h2>
          <p className="card-text">
            <span className="text-muted">by: @{author?.username}</span>
            <br />
            <time>{formatISO9075(new Date(createdAt))}</time>
            <br />
            Location: {postCode}
            <br />
            Event Type: {eventType}
            <br />
            Privacy: {privatePublic}
            <br />
            Date: {dateTime}
            <br />
            Capacity: {numberOfPeople}
            <br />
            {/* {displaySummary && (
              <>
                <span
                  className="summary"
                  dangerouslySetInnerHTML={{ __html: displaySummary }}
                ></span>
                {summary.length > MAX_SUMMARY_LENGTH && (
                  <span className="read-more" onClick={toggleSummary}>
                    {showFullSummary ? 'Read Less' : 'Read More'}
                  </span>
                )}
              </>
            )} */}
          </p>
          <div>
            {username ? (
              <>
                <button
                  className={`btn btn-primary attending-btn${isAttending ? ' active' : ''}`}
                  onClick={toggleAttending}
                >
                  {isAttending ? 'Cancel Attending' : 'Attend'}
                </button>
              </>
            ) : (
              <button className="btn btn-primary">
                <Link to="/loginsignup">Log in to attend this event.</Link>
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
  // summary: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string,
  }),
  attendeeCount: PropTypes.number.isRequired,
};
