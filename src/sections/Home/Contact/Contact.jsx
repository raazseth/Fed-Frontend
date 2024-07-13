import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/Contact.module.scss';
import contactImg from '../../../assets/images/contact.png';
import { AnimatedBox } from '../../../assets/animations/AnimatedBox';
import { Alert } from '../../../microInteraction';
import { BorderColor } from '@mui/icons-material';
import { BorderBottom } from '@mui/icons-material';

const ContactForm = () => {
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await axios.post('/api/contact', data);
      console.log('Form submitted successfully:', response.data);
      console.log('Form submitted successfully:', data);
      setAlert({ 
        type: 'success', 
        message: 'Your message has been submitted!', 
        position: 'bottom-right', 
        duration: 5000, 
        
      });
      event.target.reset(); // Clear the form fields
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({
        type: 'error',
        message: 'There was an error submitting your message. Please try again.',
        position: 'bottom-right',
        duration: 4000,

      });
      
    }
  };

  return (
    <section id="Contact Us">
      <div className={styles.contactFormContainer}>
        <h2>GET <span className={styles.highlight}>IN</span> TOUCH</h2>
        <div className={styles.bottomLine}></div>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" required 
              />
            </div>
            <div className={styles.formGroup}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" required 
              />
            </div>
            <div className={styles.formGroup}>
              <textarea 
                name="message" 
                placeholder="Message" required>
              </textarea>
            </div>
            <button type="submit">Submit</button>
          </form>

          <div className={styles.imageSection}>
            <div className={styles.backCircle}></div>
            <AnimatedBox direction="right">
              <img src={contactImg} alt="Contact" />
            </AnimatedBox>
            <div className={styles.circle}></div>
          </div>
        </div>
      </div>
      {alert && <Alert {...alert} />}
    </section>
  );
};

export default ContactForm;
