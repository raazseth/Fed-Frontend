import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/ViewMember.module.scss";
import { Button, TeamCard } from "../../../../../components";
import AddMemberForm from "../../Form/MemberForm/AddMemberForm";
import localTeamMembers from "../../../../../data/Team.json";
import AccessTypes from "../../../../../data/Access.json";

function ViewMember() {
  const [memberActivePage, setMemberActivePage] = useState("Alumni");
  const [members, setMembers] = useState([]);
  const [access, setAccess] = useState([]);

  useEffect(() => {
    // Fetch member data using axios
    const fetchMemberData = async () => {
      try {
        // const response = await axios.get("/api/user/fetchTeam");
        // const fetchedMembers = response.data;
        // setMembers(fetchedMembers);
        const testMembers = localTeamMembers;
        setMembers(testMembers);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setMembers(localTeamMembers); // Fallback to test data
      }
    };

    const fetchAccessTypes = async () => {
      try {
        // const response = await axios.get("/api/user/fetchAccessTypes");
        // const fetchedAccess = response.data;
        // setAccess(fetchedAccess);
        const testAccess = AccessTypes.data;
        const filteredAccess = testAccess.filter(accessType => (
          !["ADMIN", "USER", "PRESIDENT", "VICEPRESIDENT"].includes(accessType) &&
          !accessType.startsWith("DIRECTOR_")
        ));
        
        // Adding "Directors" and "Add Member" to the filteredAccess array
        filteredAccess.push("Directors", "Add Member");

        setAccess(filteredAccess);
      } catch (error) {
        console.error("Error fetching Access Types:", error);
        setAccess(AccessTypes.data); // Fallback to test data
      }
    };

    fetchAccessTypes();
    fetchMemberData();
  }, []);

  const headerMenu = access.map(accessType => accessType.toLowerCase());

  const renderButtons = () =>
    headerMenu.map((menu) => (
      <Button
        key={menu}
        className={styles.buttonMember}
        variant={menu === memberActivePage.toLowerCase() ? "primary" : "secondary"}
        onClick={() => setMemberActivePage(menu)}
        style={{
          borderRadius: menu !== "add member" ? "20px" : "10px",
          marginLeft: menu === "add member" ? "0px" : "0px",
        }}
      >
        {menu}
      </Button>
    ));

  const getMembersByPage = () => {
    if (memberActivePage.toLowerCase() === "add member") return [];

    if (memberActivePage.toLowerCase() === "directors") {
      // Include members with access starting with "DIRECTOR_" and PRESIDENT, VICEPRESIDENT
      return members.filter(member => (
        member.access.startsWith("DIRECTOR_") ||
        member.access === "PRESIDENT" ||
        member.access === "VICEPRESIDENT"
      ));
    }

    return members.filter(member => {
      const accessCategory = member.access.startsWith("DIRECTOR_")
        ? member.access.split('_')[1].toLowerCase() + 's'
        : member.access.toLowerCase();
      
      return accessCategory === memberActivePage.toLowerCase();
    });
  };

  const customStyles = {
    teamMember:{
      height: "10rem",
      width: "10rem",
    },

    teamMemberBackh5:{
      fontSize: "1.1rem",
    },

    socialLinksa:{
      fontSize: "2rem",
    },
    button:{
      fontSize:"1rem"
    },
    knowPara:{
      height:"10rem",
    }
    // Any other custom styles
};

  const membersToDisplay = getMembersByPage();

  return (
    <div className={styles.mainMember}>
      <div className={styles.eventmember}>
        <div className={styles.right}> 
            <div className={styles.buttonContainer}>
              <h3 className={styles.headInnerText}>
                <span>View</span> Member
              </h3>
            </div>   
          <div className={styles.buttons}>{renderButtons()}</div>
          {memberActivePage.toLowerCase() === "add member" ? (
            <AddMemberForm />
          ) : (
            <div className={styles.teamGrid}>
              {membersToDisplay.map((member, idx) => (
                <TeamCard
                  key={idx}
                  name={member.name}
                  image={member.img}
                  social={member.extra}
                  title={member.extra.title}
                  role={member.access}
                  know={member.extra.know}
                  customStyles={customStyles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewMember;
