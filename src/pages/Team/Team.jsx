import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import styles from './styles/Team.module.scss';
import { TeamCard } from '../../components';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import useWindowWidth from '../../hooks/useWindowWidth';
import MemberData from '../../data/Team.json';
import AccessTypes from '../../data/Access.json';

const Team = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState([]);
  const windowWidth = useWindowWidth(); // Use the custom hook here

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // const response = await axios.get('/api/user/fetchTeam');
        // setTeamMembers(response.data);

        // using local JSON data
        const testMembers = MemberData;
        setTeamMembers(testMembers);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching team members:', error);
        setLoading(false);
      }
    };

    const fetchAccessTypes = async () => {
      try {
        // const response = await axios.get("/api/user/fetchAccessTypes");
        // const fetchedAccess = response.data;
        // setAccess(fetchedAccess);
        const testAccess = AccessTypes.data;
        const filteredAccess = testAccess.filter(accessType => (
          !["ADMIN", "USER", "ALUMNI"].includes(accessType)
        ));

        setAccess(filteredAccess);
      } catch (error) {
        console.error("Error fetching Access Types:", error);
        setAccess(AccessTypes.data); // Fallback to test data
      }
    };

    fetchAccessTypes();
    fetchTeamMembers();
  }, []);

  console.log(access);

  const directorAccessCodes = access.filter(code => code.startsWith('PRESIDENT') || code.startsWith('VICEPRESIDENT') || code.startsWith('DIRECTOR_'));
  const roleMap = access.reduce((map, code) => {
    if (!directorAccessCodes.includes(code)) {
      let role = code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      if (role === 'Operation') role = 'Operations'; // Special case for Operations
      if (role === 'Sponsorship') role = 'Sponsorship & PR'; // Special case for Sponsorship & PR
      map[role] = code;
    }
    return map;
  }, {});

  const directorsAndAbove = teamMembers.filter(member => directorAccessCodes.includes(member.access));
  const teamByRole = Object.keys(roleMap).map(role => ({
    role,
    members: teamMembers.filter(member => member.access === roleMap[role])
  }));

  const TeamSection = ({ title, members, isDirector }) => {
    const membersPerRow = windowWidth < 500 ? 2 : 4;
    const remainderMembersCount = members.length % membersPerRow;
    const lastRowMembers = remainderMembersCount > 0 ? members.slice(-remainderMembersCount) : [];
    const otherMembers = remainderMembersCount > 0 ? members.slice(0, -remainderMembersCount) : members;

    return (
      <div className={`${styles.teamSection} ${isDirector ? styles.directorSection : ''}`}>
        {title && <h3>{title}</h3>}
        <div className={`${styles.teamGrid} ${isDirector ? styles.directorGrid : ''}`}>
          {otherMembers.map((member, idx) => (
            <TeamCard
              key={idx}
              className="teamMember"
              name={member.name}
              image={member.img}
              social={member.extra}
              title={member.extra.title}
              role={member.access}
              know={member.extra.know}
            />
          ))}
        </div>
        {lastRowMembers.length > 0 && (
          <div className={styles.lastRowCentered}>
            {lastRowMembers.map((member, idx) => (
              <TeamCard
                key={idx}
                className="teamMember"
                name={member.name}
                image={member.img}
                social={member.extra}
                title={member.extra.title}
                role={member.access}
                know={member.extra.know}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Meet Our <span style={{ background: "var(--primary)", WebkitBackgroundClip: "text", color: "transparent" }}>Team</span></h2>
      <div className={styles.para}>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam provident commodi consequatur neque magni, non tempore dolor corporis voluptate animi voluptatibus assumenda illo consectetur voluptatem quam, cum eligendi libero quos.</p>
      </div>
      <div className={styles.circle}></div>
      {/* <div className={styles.circle2}></div>  */}

      <TeamSection
        members={directorsAndAbove}
        isDirector={true}
      />

      {teamByRole.map((section, index) => (
        <TeamSection
          key={index}
          title={<span><span style={{ color: '#fff' }}>Team </span><strong style={{ background: "var(--primary)", WebkitBackgroundClip: "text", color: "transparent" }}>{section.role}</strong></span>}
          members={section.members}
          isDirector={false}
        />
      ))}

      <div className={styles.alumniBut}>
        <div className={styles.ulhover}>
          <Link to='/Alumni'>
            <span style={{ color: '#fff' }}>Meet</span> Our Alumni
          </Link>
          <FaRegArrowAltCircleRight />
        </div>
      </div>
    </div>
  );
};

export default Team;
