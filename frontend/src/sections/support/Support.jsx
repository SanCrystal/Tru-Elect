import './support.css'
import {FiSend} from 'react-icons/fi'
import { useState,useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css';
const Support = () => {
  const [emailBody,setEmailBody] = useState('');
  const sendMail = (e)=>{
    e.target.value ='';
  } 
  useEffect(() => {
    AOS.init({
      duration: 2000,
      delay: 100,
      // ease: 'easeInOutQuad',
    });
  }, []);
  return (
    <section id="support">
      <div className="container support__container">
          <h2 data-aos="zoom-in-right">Support</h2>
          <p data-aos="fade-up">Get 24/7 support us by sending a mail, and you'd get assistance by our representatives</p>
          <div className="mail">
              <textarea data-aos="fade-up" name="mail__msg" id="mail__msg" cols="60" rows="10" onChange={(e)=>setEmailBody(e.target.value)}></textarea>
              <a data-aos="fade-left" className=" btn sm primary" href={`mailto:testemail@gmail.com?subject=Support%20Needed&body=${emailBody}`} onClick={()=>sendMail()}>Send <FiSend/></a>
          </div>
      </div>
     
    </section>
  )
}

export default Support