import { render } from 'react-dom'
import React from 'react'

import HelloDev from './component/hello-dev'

render(
  <HelloDev name='Randeep' />,
  document.getElementById('app')
)
