import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles/TeamCard.module.scss';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const TeamCard = (props) => {
  const {
    name,
    image,
    social,
    title,
    role,
    know,
    customStyles = {},
  } = props;

  const [showMore, setShowMore] = useState(false);

  const isDirectorRole = ['PRESIDENT', 'VICEPRESIDENT'].includes(role) || role.startsWith('DIRECTOR_');

  return (
    <div className={styles.teamMember} style={customStyles.teamMember}>
      <div className={styles.teamMemberInner} style={customStyles.teamMemberInner}>
        <div className={styles.teamMemberFront} style={customStyles.teamMemberFront}>
          <img
            src={image}
            alt={`Profile of ${name}`}
            className={styles.teamMemberImg}
            style={customStyles.teamMemberImg}
          />
          <div className={styles.teamMemberInfo} style={customStyles.teamMemberInfo}>
            <h4 style={{ color: '#000' }}>{name}</h4>
          </div>
        </div>
        <div className={styles.teamMemberBack} style={customStyles.teamMemberBack}>
          {!showMore ? (
            <>
              <h5 style={customStyles.teamMemberBackh5}>{title}</h5>
              <div className={styles.socialLinks} style={customStyles.socialLinks}>
                {social.linkedin && (
                  <a href={social.linkedin} style={customStyles.socialLinksa} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
                {social.github && (
                  <a href={social.github} style={customStyles.socialLinksa} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                )}
              </div>
              {isDirectorRole && (
                <button
                  onClick={() => setShowMore(true)}
                  aria-expanded={showMore}
                  style={customStyles.button}
                >
                  Know More
                </button>
              )}
            </>
          ) : (
            <div className={styles.knowMoreContent} style={customStyles.knowMoreContent}>
              <div className={styles.knowPara} style={customStyles.knowPara}>
                <p>{know}</p>
              </div>
              <button
                onClick={() => setShowMore(false)}
                aria-expanded={showMore}
                style={customStyles.button}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TeamCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  social: PropTypes.shape({
    linkedin: PropTypes.string,
    github: PropTypes.string,
  }).isRequired,
  title: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  know: PropTypes.string.isRequired,
  customStyles: PropTypes.object,
};

TeamCard.defaultProps = {
  customStyles: {},
};

export default TeamCard;
