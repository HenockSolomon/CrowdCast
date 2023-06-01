import React, { useState, useEffect } from 'react';
import { formatISO9075, isAfter, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

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
  const [isAttending, setIsAttending] = useState(false);
  const [eventscollection, setEventsCollection] = useState([]);




  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/userprofile', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const userInformation = await response.json();
        //console.log(userInformation)
        setUserInfo(userInformation);

        if (userInformation && userInformation.username) {
          setUsername(userInformation.username);
          let userAttending = attendingUsers.filter((user) => user.userId === userInformation.id)
          console.log(userAttending , '62')
          // console.log(userInformation.id)
          // console.log(attendingUsers[0].userId)
          if (userAttending.length !== 0) {
            setIsAttending(true);
          }
          else{
            setIsAttending(false);
          }
          

          //console.log(attendingUsers.map((user) => user.userId))
          // console.log(attendingUsers.filter((user) => user.userId === userInformation._id), '63')
        } else {
          setUsername('');
          setIsAttending(false);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchUserProfile();
  }, [attendingUsers, setIsAttending]);


  const toggleAttending = async () => {
    if (!username) {
      alert('Please log in to attend the event.');
      return;
    }

    if (isAttending) {
      cancelAttendEvent();
    } else {
      try {
        const response = await axios.put(`http://localhost:8000/post/${_id}/${userInfo.id}`);

        if (!response.ok) {
          console.log(username, 'is already attending the event');
          
        }

        
        const updateUserData = await axios.get(`http://localhost:8000/post/${_id}/${userInfo.id}`);
        console.log(updateUserData.data , '75');

        const res = await axios.get(`http://localhost:8000/post/${_id}`);
        const eventData = res.data;

        console.log(eventData , '81');

        const matches = updateUserData.data.filter((event) => event._id === eventData._id);

        if (matches.length > 0) {
          
           setIsAttending(true);
           
           
          console.log('Event matched in the user\'s attended events');
          
        } else {
          // User hasn't attended this event, show "Attend" button
          console.log('Event not found in the user\'s attended events');
          setIsAttending(false);
        }
 const updatedUserInfo =  updateUserData.json();
 console.log(updatedUserInfo , '97')
        setUserInfo(updatedUserInfo);
        
         


      } catch (error) {
        console.error('There was a problem with the API request:', error);
      }
    }
  };

  const cancelAttendEvent = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/post/${_id}/${userInfo.id}`);
      console.log(response);
      setIsAttending(false);
  
      if (response.status !== 200) {
        throw new Error('Failed to cancel attendance.');
      }
  
      const profileResponse = await axios.get('http://localhost:8000/userprofile', {
        credentials: 'include',
      });
  
      if (profileResponse.status !== 200) {
        throw new Error('Failed to fetch user profile data');
      }
  
      const updatedUserInfo = await profileResponse.data;
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error('There was a problem with the API request:', error);
    }
  };
  
  

 


  const currentDate = new Date();
  const eventDate = new Date(dateTime);
  const isEventExpired = isAfter(currentDate, subDays(eventDate, 1));

  if (isEventExpired) {
    return null; // Skip rendering the post if it has already passed
  }
  
  return (
    <div className="CardGroup entire col-md-5">
       
      <div className="card">
      <Link to={`/post/${_id}`}><img className="card-img-top custom-card-image " src={`http://localhost:8000/${coverImg}`} alt={title} /></Link>
        <div className="card-body">
          <Link to={`/post/${_id}`}>
          <h2 className="card-title">{title}
          </h2>
          <p className="card-text">
            <span className="text-muted">by: @{author?.username}</span> At: <time>  {formatISO9075(new Date(createdAt))}</time>
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg> &nbsp;
            Location: {postCode}
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-incognito" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205a1.032 1.032 0 0 0-.014-.058l-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5c-.62 0-1.411-.136-2.025-.267-.541-.115-1.093.2-1.239.735Zm.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a29.58 29.58 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274ZM3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Zm-1.5.5c0-.175.03-.344.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085c.055.156.085.325.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0v-1Zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Z"/>
</svg>  &nbsp;
            Event Type: {eventType}
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-unlock" viewBox="0 0 16 16">
  <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
</svg>&nbsp;
            Event is For: {privatePublic}
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
</svg>     &nbsp;  Date : {dateTime}
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
</svg> &nbsp;
            Capacity: {numberOfPeople}
            <br />
          
            <p>
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-balloon" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 9.984C10.403 9.506 12 7.48 12 5a4 4 0 0 0-8 0c0 2.48 1.597 4.506 4 4.984ZM13 5c0 2.837-1.789 5.227-4.52 5.901l.244.487a.25.25 0 1 1-.448.224l-.008-.017c.008.11.02.202.037.29.054.27.161.488.419 1.003.288.578.235 1.15.076 1.629-.157.469-.422.867-.588 1.115l-.004.007a.25.25 0 1 1-.416-.278c.168-.252.4-.6.533-1.003.133-.396.163-.824-.049-1.246l-.013-.028c-.24-.48-.38-.758-.448-1.102a3.177 3.177 0 0 1-.052-.45l-.04.08a.25.25 0 1 1-.447-.224l.244-.487C4.789 10.227 3 7.837 3 5a5 5 0 0 1 10 0Zm-6.938-.495a2.003 2.003 0 0 1 1.443-1.443C7.773 2.994 8 2.776 8 2.5c0-.276-.226-.504-.498-.459a3.003 3.003 0 0 0-2.46 2.461c-.046.272.182.498.458.498s.494-.227.562-.495Z"/>
</svg>
          {attendingUsers.length >0 ? ( `${attendingUsers.length} Person Attending This Event`
          ) : ('No Person Attending This Event Yet') 
          } 
          </p> 
          </p>
         
          </Link>
          <div className='attend-detail-container'>
            {username ? (
              <div>
              
              <button
                className={`before btn btn-primary attending-btn$`}
                onClick={toggleAttending}
              >
                {isAttending ? (
                  
                    
                   <div onClick={cancelAttendEvent}>
                      Cancel Attending
            
                  </div>
                
                ) : (
                  'Attend'
                )}
              </button>
              <Link to={`/post/${_id}`}><button className="btn before">See Details</button></Link>
            </div>
            ) : (<>
              <button className="btn before">
                <Link to="/loginsignup"> Log in to attend</Link>
              </button>
              

              <Link to={`/post/${_id}`}><button className="btn before"> See Details</button></Link> 

            
            </>)}
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
