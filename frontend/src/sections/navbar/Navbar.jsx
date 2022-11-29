import './navbar.css'
import Logo from '../../assets/logo.png';
import {data,data1} from './data'
import {IoIosColorPalette} from 'react-icons/io'
import {GiHamburgerMenu} from 'react-icons/gi'
import {ImCross} from 'react-icons/im'
import { useModalContext } from '../../context/modal-context';
import { useState } from 'react';




const Navbar = () => {
  const {showModalHandler} = useModalContext();
  const [showLinks,setShowLinks] = useState(false)
  const [connect,setConnect] = useState('');
  const [navSm,setNavSm] = useState('');

  const showLinksHandler = ()=>{
    setShowLinks(true);
    setNavSm('nav__menu-sm');
    setConnect('connect-sm');
  } 
  const hideLinksHandler = ()=>{
    setShowLinks(false);
    setNavSm('hide');
    setConnect('hide');
  }

  return (
    <nav id='nav'>
      <div className="container nav__container"><a href="index.html" className='nav__logo'><img src={Logo} alt="Logo" /></a>

       <ul className={`nav__menu ${navSm}`}>
          {
            data.map(item=><li key={item.id}><a href={item.link} >{item.title}</a></li>)
          }
         </ul>
  
       <ul className={`connect ${connect}`}>
          {
            data1.map(item=><li key={item.id}><a className=" btn sm" href={item.link}>{item.title}</a></li>)
          }
      </ul>
   
      <button id='theme__icon' onClick={()=> showModalHandler()}><IoIosColorPalette/></button>
      {
        !showLinks && <div className="nav__icon" onClick={()=>showLinksHandler()}>
        <GiHamburgerMenu/>
    </div>
      }
      
      {
        showLinks &&  <div className="nav__close" onClick={()=>hideLinksHandler()}>
        <ImCross/>
    </div>
      }
     
      </div>
    </nav>
  )
}

export default Navbar