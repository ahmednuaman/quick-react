import HelloDev from './component/hello-dev'
import React from 'react'
import render from './render'

render(
  <HelloDev name='Ahmed' />,
  document.getElementById('app')
)
