import './footer.css'
import {links,socials,links2} from './data'
import {useEffect} from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css';
import Logo from '../../assets/logo.png';
import {RiCopyrightLine} from 'react-icons/ri'
const Footer = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      delay: 100,
      // ease: 'easeInOutQuad',
    });
  }, []);
  return (
    <footer id='footer'>
        <div className="container footer__container">
      
          {
            Array(6).fill(0).map((element,ind)=>(
              <div key={ind} className="underlay-background"></div>
            ))
          }
      
        
          <div className="social__container">
              <div className="social__logo" data-aos="fade-right">
                  <a href="/">
                    <img src={Logo} alt="home logo" />
                  </a>
              </div>
              
              <p data-aos="fade-up"><RiCopyrightLine/> 2022 All Rights Reserved TruElect</p>
              <div className="footer__socials">
                {
                  socials.map((social,ind,arr)=>(
                    <a key={social.id} href={social.link} data-aos={`${ind%2===0?"zoom-in-left":"zoom-in-right"}`} data-aos-offset="-50" target='_blank' rel='noopener noreferrer'>
                      {social.icon}
                    </a>
                  ))
                }
              </div>
          
            </div>
            <div className="footer__nav">
             <h2 data-aos="zoom-in-right">Company</h2>
            <ul className="nav__menu">
                  {
                    links.map((flink,ind,arr)=>(
                      <li key={flink.id} data-aos={`${ind%2===0?"fade-left":"fade-right"}`}>
                        <a href={flink.link} target='_blank' rel='noopener noreferrer'>
                          {flink.title}
                        </a>
                      </li>
                    ))
                  }
            </ul>
          </div>
          
          <div className="footer__nav">
              <h2 data-aos="zoom-in-left">Support</h2>
              <ul className="nav__menu">
                    {
                      links2.map((flink,ind,arr)=>(
                        <li key={flink.id} data-aos={`${ind%2===0?"fade-left":"fade-right"}`}>
                          <a href={flink.link} >
                            {flink.title}
                          </a>
                        </li>
                      ))
                    }
              </ul>
          </div>
        </div>
        
    </footer>
  )
}

export default Footer