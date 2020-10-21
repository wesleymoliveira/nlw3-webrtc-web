import React from 'react'
import logo from '../images/LogoHappy.svg'
import '../styles/components/logoHappy.css'

function LogoHappy(){
    return (
        <div className="logo">
            <img className="logoImage" src={logo} alt="Happy Logo"/>
        </div>
    )
}

export default LogoHappy