import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles/EventsView.module.scss";
import AuthContext from "../../../../context/AuthContext";
import eventsData from "../../../../data/eventData.json";
import { EventModal } from "../../../../features/Modals";

const Events = () => {
  const authCtx = useContext(AuthContext);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        // const response = await axios.get("/api/form/getAllForms");
        // const fetchedEvents = response.data;
        // const allEvents = fetchedEvents
        const testEvents = eventsData;
        const allEvents = testEvents;

        const filteredEvents = allEvents.filter((event) =>
          event.registeredUsers && event.registeredUsers.some(user => user.email === authCtx.user.email)
        );

        setUserEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventsData();
  }, [authCtx.user.email]);

  const handleView =()=>{
    <EventModal/>
  }

  return (
    <div className={styles.participatedEvents}>
      <div className={styles.proHeading}>
        <h3 className={styles.headInnerText}>
          <span>Participated</span> Events
        </h3>
      </div>

      <div className={styles.tables}>
        {userEvents.length > 0 ? (
          <table className={styles.eventsTable}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Date</th>
                <th className={styles.mobilewidth}>View</th>
                {/* Add more headers */}
              </tr>
            </thead>

            <tbody >
              {userEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.eventName}</td>
                  <td>{event.eventDate}</td>
                  <td className={styles.mobilewidthtd}><button onClick={handleView}>View</button></td>
                  {/* Add more table cells */}
                </tr>
              ))}
            </tbody>
            
          </table>
        ) : (
          <p className={styles.noEvents}>Not participated in any Events</p>
        )}
      </div>
    </div>
  );
};

export default Events;
