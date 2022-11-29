import './header.css'
import HeaderImage from '../../assets/truelect.png'
import AOS from 'aos'
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Pack from '../../components/Pack';
const Header = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      delay: 200,
      // ease: 'easeInOutQuad',
    });
  }, []);
  return (
    <header id='header'>
      <div className="container header__container">
        <div className="header__profile" data-aos="zoom-in">
          <img src={HeaderImage} alt="header background" />
        </div>
        <div className="header__content"> 
            <h1 data-aos="fade-up"> Vote Transparently</h1>
            <h2 data-aos="fade-up"> Vote Your Candidates</h2>
            <h3 data-aos="fade-up"> Your Vote Counts</h3>
            <p data-aos="fade-up">Conduct electorial processes on the blockchain!.</p>
            <p data-aos="fade-up">Vote with ease and for your candidates with the mindset, that there is <span><strong>zero manipulations</strong></span> since the electorial process one the smart contract and is made public from start to finish.</p>
            <div className="header__cta" data-aos="fade-up">
              <a href="#explore" data-aos="fade-up" className='btn primary'>Explore</a>
              <a href="#get__started" data-aos="fade-up" className='btn light'>Get Started</a>
            </div>
        </div>
        <div className="election__counts">
          <Pack className="election__counts-pack">
            <h1 data-aos="zoom-in-right">80+</h1>
            <p data-aos="fade-up">Elections held</p>
          </Pack>
          <Pack className="election__counts-pack">
            <h1 data-aos="zoom-in-down">2</h1>
            <p data-aos="fade-up">Elections On Going</p>
          </Pack>
          <Pack className="election__counts-pack">
            <h1 data-aos="zoom-in-left">12</h1>
            <p data-aos="fade-up">Upcoming Elections</p>
          </Pack>

        </div>
      </div>
      
    </header>
  )
}

export default Header