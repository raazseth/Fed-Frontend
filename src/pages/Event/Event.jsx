import{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import style from "./styles/Event.module.scss";
import { EventCard } from "../../components";
// import EventData from "../../data/eventData.json";
import FormData from "../../data/FormData.json"
import ring from "../../assets/images/ring.svg";
import { MdKeyboardArrowRight } from "react-icons/md";

const Event = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);


   console.log(FormData);
   const{events}=FormData;
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const response = await axios.get('/api/form/getAllForms');
        // setEvents(response.data);

        // using local JSON data
      
        const localEventData = events;
        setEventData(localEventData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  // console.log(localEventData)

  const ongoingEvents=eventData.filter((event)=>event.info.ongoingEvent)
  const pastEvents=eventData.filter((event)=>!event.info.ongoingEvent)




  // const ongoingEvents=events.filter((event)=>event.info.ongoingEvent)
  // const pastEvents=events.filter((event)=>!event.info.ongoingEvent)
  
  const customStyles = {
    eventname: {
      fontSize: "1.2rem",
    },
    registerbtn: {
      width: "8rem",
      fontSize:".721rem"

    },
    eventnamep: {
      fontSize: "0.7rem",
    },
  };

  return (
    <div className={style.main}>
      <div style={{ display: "flex" }}>
        <div className={style.line}></div>
        <div className={style.eventwhole}>
          {ongoingEvents.length>0 &&
          <div className={style.eventcard}>
            <div className={style.name}>
              <img className={style.ring1} src={ring} alt="ring" />
              <span className={style.w1}>Ongoing</span>
              <span className={style.w2}>Events</span>
            </div>
            <div className={style.cardsin}>
              {ongoingEvents.map((event, index) => (
                <div style={{ height: "auto", width: "22rem" }} key={index}>
                  <EventCard
                    data={event}
                    onOpen={() => console.log("Event opened")}
                    type="ongoing"
                    customStyles={customStyles}
                    modalpath='/Events/'
                    aosDisable={false}
                  />
                </div>
              ))}
            </div>
          </div>
}

          <div className={style.pasteventcard} style={{marginTop:ongoingEvents.length>0?"6rem":"1rem"}}>
            <div className={style.name}>
              <img className={style.ring2} src={ring} alt="ring" />
              <span className={style.w1}>Past</span>
              <span className={style.w2}>Events</span>
            </div>
            <div className={style.cardone}>
              {pastEvents.map((event, index) => (
                <div style={{ height: "auto", width: "22rem" }} key={index}>
                  <EventCard
                    data={event}
                    type="past"
                    customStyles={customStyles}
                    modalpath='/Events/pastEvents/'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={style.bottom}>
        <Link to="/Events/pastEvents">
          <button className={style.seeall}>
            See all <MdKeyboardArrowRight />
          </button>
        </Link>
      </div>

      <div className={style.circle}></div>
      <div className={style.circleleft}></div>
      <div className={style.circleone}></div>
      <div className={style.circletwo}></div>
      <div className={style.circlethree}></div>
    </div>
  );
};

export default Event;
