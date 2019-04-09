import React, { Component } from 'react'
import { fb } from './LiveData'

class Scores extends Component {
  constructor() {
    super()
    this.state = {
      scores: null
    }
  }

  componentDidMount() {
    const scoresRef = fb.ref('masters/live-data')
    scoresRef.on('value', snapshot => {
      const scores = snapshot.val()
      this.setState({ scores })
    })
  }

  render() {
    const { scores } = this.state
    return (
      <div id="score-table">
        <div>
          <h2>Score Table</h2>
        </div>
        <div id="table-main">
          <table>
            <thead>
              <tr id="table-header">
                <th>position</th>
                <th>player</th>
                <th>player_id</th>
                <th>par</th>
                <th>bonus</th>
                <th>today</th>
                <th>thru</th>
                <th>rnd_1</th>
                <th>rnd_2</th>
                <th>rnd_3</th>
                <th>rnd_4</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
              {
                scores
                  ? Object.keys(scores).map(row => {
                    const { position, player, id, par, bonus, today, thru, rnd_1, rnd_2, rnd_3, rnd_4, total } = scores[row]
                    return (
                      <tr key={id}>
                        <td>{position}</td>
                        <td>{player}</td>
                        <td>{id}</td>
                        <td>{par}</td>
                        <td>{bonus}</td>
                        <td>{today}</td>
                        <td>{thru}</td>
                        <td>{rnd_1}</td>
                        <td>{rnd_2}</td>
                        <td>{rnd_3}</td>
                        <td>{rnd_4}</td>
                        <td>{total}</td>
                      </tr>
                    )
                  })
                  : <div>Empty</div>
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Scores
