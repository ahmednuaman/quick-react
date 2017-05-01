/* global module, PRODUCTION */

import { render } from 'react-dom'
import React from 'react'

export default (Contents, target) => {
  let App

  if (!PRODUCTION && module.hot) {
    const { AppContainer } = require('react-hot-loader')

    App =
      <AppContainer>
        <Contents />
      </AppContainer>
  } else {
    App =
      <Contents />
  }

  console.log(App)

  return render(App, target)
}
