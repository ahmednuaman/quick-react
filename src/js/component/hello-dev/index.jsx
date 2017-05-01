import React from 'react'
import styles from './index.less'

export default ({ name = 'dev' }) =>
  <div className={styles.helloDev}>Helllo {name}!</div>
