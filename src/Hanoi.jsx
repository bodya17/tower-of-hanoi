import React, {Component} from 'react';

function nth(arr, i) {
  return i >= 0 ? arr[i] : arr[arr.length + i];
}

// arr should be two dimensional array
function rotate(arr) {
  let res = [];
  for (let i = 0; i < arr[0].length; i++) {
    res.push(arr.map(x => nth(x, i)));
  }
  return res;
}

function getUntouchedPeg(...pegs) {
  if (pegs.includes(0) && pegs.includes(1)) return 2
  if (pegs.includes(1) && pegs.includes(2)) return 0
  if (pegs.includes(0) && pegs.includes(2)) return 1
}

function whereOneAppeared(prev, next) {
  const prevArr = prev.split('')
  const nextArr = next.split('')
  return prevArr.length - nextArr.findIndex((el, i) => el === '1' && prevArr[i] === '0') - 1
}

function topElement(arr) {
  return arr.find(x => x !== null)
} 

function availablePeg(from, pegs) {
  const top = topElement(pegs[from])
  let unavailable
  for (var i = 0; i < pegs.length; i++) {
    if (topElement(pegs[i]) < top)
      unavailable = i
  }
  return getUntouchedPeg(unavailable, from)
}

function toBin(n) {
  return n.toString(2)
}

// prependNulls([1,2,3], 5) => [null, null, 1, 2, 3]
function prependNulls(arr, n) {
  const copy = [...arr]
  for (var i = 0; i < n - arr.length; i++) {
    copy.unshift(null)
  }
  return copy
}

function onWhichPegDisk(pegs, disk) {
  for (var i = 0; i < pegs.length; i++) {
    if (pegs[i].includes(disk))
      return i
  }
}

export class Hanoi extends Component {
  constructor(props) {
    super(props);
    this.numberOfPegs = 8
    this.state = {
      game: [
        new Array(this.numberOfPegs).fill(true).map((x, i) => i), // first peg
        [],
        [],
      ],
      num: 0,
      finish: null
    }
    this.itervalID = setInterval(() => {
      if (!this.winCheck())
        this.move()
      else {
        clearInterval(this.itervalID)
        this.setState({finish: 'Done!'})
      }
    }, 1000);
  }
  
  winCheck = () => {
    const {game} = this.state
    const winStack = new Array(this.numberOfPegs).fill(true).map((x, i) => i).join('')
    return (game[1].join('') === winStack || game[2].join('') === winStack)
  }
  
  move = () => {
    this.setState(({game, num}) => {
      const diskToMove = whereOneAppeared(toBin(num), toBin(num + 1))
      let from = onWhichPegDisk(game, diskToMove)
      let to
      
      const newPos = []
      
      if (diskToMove === 0) {
        if (from === 0) { to = 1}
        if (from === 1) { to = 2}
        if (from === 2) { to = 0}
      } else {
        to = availablePeg(from, game)
      }
      const untouchedPegIndex = getUntouchedPeg(from, to)
      const valueToMove = game[from].find(x => x !== null)
      const rest = game[from].slice(game[from].indexOf(valueToMove) + 1)
      const destinationPeg = [valueToMove, ...game[to].filter(x => x !== null)]
      const n = game[0].length
      newPos[from] = prependNulls(rest, n)
      newPos[to] = prependNulls(destinationPeg, n)
      newPos[untouchedPegIndex] = game[untouchedPegIndex]

      return {
        game: newPos,
        num: num + 1
      }
    })
  }

  renderBoard = () => {
    return rotate(this.state.game).map(row => <tr>{row.map(x => <td>{x}</td>)}</tr>)
  }

  render() {

    return (<div>
      <table>
        {this.renderBoard()}
      </table>
      {this.state.num}
      <h1>{this.state.finish}</h1>
    </div>)
  }
}

export default Hanoi;
