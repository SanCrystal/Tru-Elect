import './faqs.css'
import Faq from './data'
import FAQ from './FAQ'
import {useEffect} from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css';
const Faqs = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      delay: 100,
      // ease: 'easeInOutQuad',
    });
  }, []);
  return (
    <section id='faqs'>
      <h2 data-aos="zoom-out-right">Frequently Asked Questions</h2>
      <p data-aos="fade-up">There are some questions I usually get when conversing with my clients. Click to toggle the answers, and if you've' got some more questions , shoot me a message in the contact section!</p>
      <div className="container faqs__container">
          {
            Faq.map((faq,ind,arr)=>(
              <FAQ key={faq.id} faq={faq} dataAos={`${ind%2===0?"fade-left":"fade-right"}`}/>
            ))
          }
      </div>
    </section>
  )
}

export default Faqs