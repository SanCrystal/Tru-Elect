import './howitworks.css'
import data from './data'
import Pack from '../../components/Pack'
import Linker from '../../components/Linker';
import {useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css';
const Howitworks = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      delay: 100,
      // ease: 'easeInOutQuad',
    });
  }, []);
  return (
    <section id='howitworks'>
      <div className="container flow__pack">
        <h2 data-aos="zoom-in-right">How it works</h2>
          <div className="linkage">
              { 
                Array(data.length -2).fill(0).map((element,ind,arr)=>(
                  <Linker dataAos={`${ind%2===0?'fade-up':'fade-down'}`} key={ind} className="linkage__item">
                    <span></span>
                    <span></span>
                  </Linker>
                ))
              }
          </div>
          <div className="flow__pack-items">
            
            {  
               data.map(({id,icon,title,body})=>(
                <Pack key={id} className="flow__pack-item">
                  <div className="icon__wrap">
                      <div className='flow__icon'>{icon}</div>
                  </div>
                  <h3 data-aos="fade-up">{title}</h3>
                  <p data-aos="fade-up">{body}</p>
                </Pack>
              ))
            }
            
          </div>
      </div>
    </section>
  )
}

export default Howitworks