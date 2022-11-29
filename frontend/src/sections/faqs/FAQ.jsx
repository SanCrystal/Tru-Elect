import Card from '../../components/Card';
import {AiOutlinePlus,AiOutlineMinus} from 'react-icons/ai'
import { useState } from 'react';

const FAQ = ({faq,dataAos}) => {
    const [showAnswer, setShowAnswer] = useState(false);
  return (
    <Card className='faq' dataAos={dataAos} onClick={()=>setShowAnswer(prev=>!prev)}>
        <div>
            <h5 className='faq__question'>{faq.question}</h5>
            <button className="faq__icon" >
                {showAnswer? <AiOutlineMinus/>: <AiOutlinePlus/>
                }
            </button>
        </div>
        {
            showAnswer &&  <p className={`${showAnswer?"faq__answer":"faq__hide"}`}>
            {faq.answer}
        </p>
        }
         {
            !showAnswer &&  <p className={`${showAnswer?"faq__answer":"faq__hide"}`}>
            {faq.answer}
        </p>
        }
       

    </Card>
  )
}

export default FAQ