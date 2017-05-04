import { render } from 'react-dom'
import HelloDev from './component/hello-dev'
import React from 'react'

render(
  <div className='container-fluid'>
    <nav className='navbar navbar-inverse'>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <HelloDev name='Ahmed' />
        </div>
      </div>
    </nav>
  </div>,
  document.getElementById('app')
)
