import React, { Component } from 'react'
import axios from 'axios'
import Firebase from "firebase"

Firebase.initializeApp({
  apiKey: "AIzaSyDJQ6s4evuq-frat97rxhLJ4LQ1pAOzbpY",
  authDomain: "pga-majors-pool.firebaseapp.com",
  databaseURL: "https://pga-majors-pool.firebaseio.com",
  storageBucket: "pga-majors-pool.appspot.com"
})

export const fb = Firebase.database()

export class LiveData extends Component {
  constructor() {
    super()
    this.state = {
      liveData: false,
      lastPull: '',
      lastPullKey: '',
      timerRef: {}
    }

    this.handleClickON = this.handleClickON.bind(this)
    this.handleClickOFF = this.handleClickOFF.bind(this)
  }

  componentDidMount() {
    const archiveRef = fb.ref('masters/archive')
    const liveDataStatus = fb.ref('masters/live-data-status')

    archiveRef.on('value', snapshot => {
      if (snapshot.val()) {
        const timestampArr = Object.keys(snapshot.val())
        // "count" = last child. this is why we need 2nd to last
        const lastPullRef = timestampArr[timestampArr.length - 2]
        const lastPull = new Date(Number(lastPullRef)).toLocaleTimeString()
        this.setState({ lastPull, lastPullKey: lastPullRef })
      }
    })

    liveDataStatus.on('value', snapshot => {
      this.setState({ liveData: snapshot.val() })
    })

  }

  handleClickON() {
    try {
      // do set interval here
      console.log('Turning live-data ON')
      const dataON = async () => {
        await axios.get('/api/livedata/on')
      }
      dataON()
      const timerRef = setInterval(dataON, 60000 * 2)
      this.setState({ timerRef })
    } catch (e) {
      console.log('Error starting live data')
    }
  }

  async handleClickOFF(evt) {
    try {
      // call api to turn data off
      evt.preventDefault()
      console.log('Turning live-data OFF')
      clearInterval(this.state.timerRef)
      await axios.get('/api/livedata/off')
    } catch (e) {
      console.log('Error turning data OFF')
    }
  }

  render() {
    const { liveData, lastPull, lastPullKey } = this.state
    return (
      <div id="live-data">
        <h2>Live Data</h2>
        <div id="timer">
          {
            liveData
              ? <p>Data is ON - Last pull at {lastPull} - {lastPullKey}</p>
              : <p>Data is OFF - last pull at {lastPull} - {lastPullKey}</p>
          }
        </div>
        <div id="live-data-buttons">
          <button type="button" id="live-data-on" onClick={this.handleClickON}>DATA ON</button>
          <button type="button" id="live-data-off" onClick={this.handleClickOFF}>DATA OFF</button>
        </div>
      </div >
    )
  }
}
