import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import style from './styles/PastEvent.module.scss';
import { EventCard } from '../../components';
// import EventData from '../../data/eventData.json';
import FormData from "../../data/FormData.json"

const PastEvent = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [activeEventId, setActiveEventId] = useState(null);

  const{events}=FormData;

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPastEvents = async () => {
      try {
        // const response = await axios.get('/api/form/getAllForms');
        // setPastEvents(response.data.filter(event => !event.ongoingEvent));

        // using local JSON data
        const localEventData = events.filter(event => !event.info.ongoingEvent);
        setPastEvents(localEventData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching past events:', error);
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  // const handleModalOpen = (eventId) => {
  //   setActiveEventId(eventId);
  //   document.body.style.overflow = 'hidden';
  // };

  // const handleModalClose = () => {
  //   setActiveEventId(null);
  //   document.body.style.overflow = 'unset';
  // };

  return(
    <div className={style.main}>
        <Link to={'/Events'}>
        <div className={style.ArrowBackIcon}>
          <ArrowBackIcon />
        </div>
      </Link>
    <div className={style.whole}>
      <div className={style.eventwhole}>

        <div className={style.pasteventCard}>
          <div className={style.name}>
          <span className={style.w1}>Past</span>
          <span className={style.w2}>Events</span>
          </div>
          <div className={style.Outcard}>
            <div className={style.cardone}>
              {pastEvents.map((event, index) => (
                <div style={{height: "auto", width: "22rem"}} key={index}>
                  <EventCard
                  data={event}
                  type="past"
                  // customStyles={customStyles}
                  modalpath='/pastEvents/'
                  aosDisable={false}
                />

                
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={style.circle}></div>
      <div className={style.circleone}></div>
      <div className={style.circletwo}></div>
      <div className={style.circlethree}></div>
    </div>
  </div>
);
}

export default PastEvent;