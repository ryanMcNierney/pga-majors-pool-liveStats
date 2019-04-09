import React, { Component } from 'react'
import { LiveData } from './LiveData'
import Scores from './Scores'
import './admin.css'

class Admin extends Component {
  render() {
    return (
      <div id="admin">
        ADMIN Page
        <LiveData />
        <Scores />
      </div>
    )
  }
}

export default Admin
