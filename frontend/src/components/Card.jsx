import './card.css'

const Card = ({children,className,onClick,dataAos}) => {
  return (
    <article className={`card ${className}`} data-aos={dataAos} onClick={onClick}>
      {children}
    </article>
  )
}

export default Card