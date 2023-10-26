import React from 'react'
import './NtuaHeader.css'
import PyrforosImage from '../assets/images/pyrforos.svg'


export default function NtuaHeader() {
  return (
    <div className='ntua-header'>
      <div className='ntua-logo-header'>
        <img src={PyrforosImage} alt='NTUA Pyrforos' className='ntua-logo'/>
        <span className="ntua-title">ΕΘΝΙΚΟ<br/>ΜΕΤΣΟΒΙΟ<br/>ΠΟΛΥΤΕΧΝΕΙΟ</span>
      </div>
      {/* <div className='ntuafix-header'> */}
        {/* <h1>NtuaFix</h1> */}
      {/* </div> */}
    </div>
  )
}
