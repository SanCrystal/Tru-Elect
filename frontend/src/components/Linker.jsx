const Linker = ({className,children,dataAos}) => {
  return (
    <div data-aos={dataAos} className={className}>
        {children}
    </div>
  )
}

export default Linker