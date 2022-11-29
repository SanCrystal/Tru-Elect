
import Modal from '../components/Modal';
import BackgroundColor from './BackgroundColor';
import {primaryColors,backgroundColors} from './data'
import PrimaryColor from './PrimaryColor';
import './theme.css'
const Theme = () => {
  return (
    <Modal className="theme__modal">
        <h3>Customize Your theme</h3>
        <small>Change the your background colors to match your preference.</small>
        <div className="theme__primary-wrapper">
            <h5>Primary Colors</h5>
           <div className="theme__primary-colors">
                {
                    primaryColors.map(color=>(
                        <PrimaryColor key={color.className} className={color.className}/>
                    )
                    )
                }
           </div>
        </div>
        <div className="theme__background-wrapper">
            <h5>Background Color</h5>
            <div className="theme__background-colors">
                {
                    backgroundColors.map(
                        color=>(
                            <BackgroundColor key={color.className} className={color.className}>

                            </BackgroundColor>
                        )
                    )
                }
            </div>
        </div>
    </Modal>
  )
}

export default Theme