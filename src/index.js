import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


function Square(props) {
  const button=props.highlight?<button style={{backgroundColor:"red"}} className='square' onClick={props.onClick}>
  {props.value}</button>:<button className='square' onClick={props.onClick}>
  {props.value}
</button>
  return (
    button
  )
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine=this.props.winLine
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine&&winLine.includes(i)}
      />
    );
  }

  render() {
    const boardSize=5
    let squares=[]
    for(let i=0;i<boardSize;++i) {
      let row=[]
      for(let j=0;j<boardSize;++j) {
        row.push(this.renderSquare(i*boardSize+j))
      }
      squares.push(<div key={i} className="board-row">{row}</div>)
    }
    return (
      <div>
        {squares}
      </div>
    )
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(25).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    } 
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2)===0,
    })
  }

  handleSort() {
    this.setState({isAscending: !this.state.isAscending})
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const win=calculateWinner(current.squares)
    const winner = win.winner
    const isAscending=this.state.isAscending

    const moves = history.map((step, move) => {
      const lastSquare=step.lastSquare
      const col=1+ lastSquare%5
      const row=1+Math.floor(lastSquare/5)
      const desc = move ?
        'Go to move #' + move + ' at position ('+col+','+row+')' :
        'Go to game start'
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{move===this.state.stepNumber?<b>{desc}</b>:desc}</button>
        </li>
        )
    })

    if(!isAscending)
      moves.reverse()
    

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } 
    else {
      if(win===current.squares.length)
        status="Game is draw"
      else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={win.line}
          />
        </div>
        <div className="game-info">
          <div><b>{status}</b></div>
          <button onClick={()=>this.handleSort()}>{isAscending?'Ascending':'Descending'}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2,3,4],
    [5,6,7,8,9],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24],
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],
    [0,6,12,18,24],
    [4,8,12,16,20],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c,d,e] = lines[i];
    if (squares[a] && 
      squares[a] === squares[b] 
      && squares[a] === squares[c]
      && squares[a] === squares[d]
      && squares[a] === squares[e]) {
      return {
        winner: squares[a],
        line: lines[i]
      }
    } 
  }
  for(let i =0; i< squares.length;++i) {
    if(squares[i]===null)
    return {
      winner: null,
      line: []
    }
  }
  return squares.length
}

const root=ReactDOM.createRoot(document.getElementById("root"))
root.render(<Game />)

