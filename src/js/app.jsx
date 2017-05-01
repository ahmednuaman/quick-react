import { render } from 'react-dom'
import HelloDev from './component/hello-dev'
import React from 'react'

render(
  <HelloDev name='Ahmed' />,
  document.getElementById('app')
)
