import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  const color = (props.winnerSquar ? 'red' : '');
  return (
    <button className="square" onClick={props.onClick} style={{color:color}}>
    {props.value}
    </button>
    );
}

class Board extends React.Component {
  bulidRows(rown, coln) {
    let rows = [];
    for (var i = 0; i < rown; i++) {
      let row = this.buildCols(i,coln);
      rows.push(row);
    }
    return rows;
  }

  buildCols(row, coln) {
    let cols = [];
    for (var i = 0; i < coln; i++) {
      let col = this.renderSquare(row*coln + i);
      cols.push(col);
    }
    let col = <div className="board-row" key={row}>{cols}</div>
    return col;
  }

  renderSquare(i) {
    const winnerSquars = this.props.winnerSquars;

    let isWinnerSquars = false;
    if (winnerSquars && winnerSquars.includes(i)) {
      isWinnerSquars = true;
    }

    return (
      <Square key={i}
      value={this.props.squares[i]}
      winnerSquar={isWinnerSquars}
      onClick={() => this.props.onClick(i)}
      />
      );
  }

  render() {
    return (<div>{this.bulidRows(3, 3)}</div>);
    // return (
    //   <div> 
    //   <div className="board-row">
    //   {this.renderSquare(0)}
    //   {this.renderSquare(1)}
    //   {this.renderSquare(2)}
    //   </div>
    //   <div className="board-row">
    //   {this.renderSquare(3)}
    //   {this.renderSquare(4)}
    //   {this.renderSquare(5)}
    //   </div>
    //   <div className="board-row">
    //   {this.renderSquare(6)}
    //   {this.renderSquare(7)}
    //   {this.renderSquare(8)}
    //   </div>
    //   </div>
    //   );
  }
}

class Game extends React.Component {
  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = this.state.winnerSquars;

    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const x = i % 3;
    const y = (i - x) / 3;

    const winnerSquars = calculateWinner(squares);
    
    this.setState({
      history: history.concat([{
      squares: squares,
      x: x,
      y: y,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winnerSquars: winnerSquars,
    });
  }

  jumpTo(step) {
    const winnerSquars = calculateWinner(this.state.history[step].squares);

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winnerSquars: winnerSquars,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        x: null,
        y: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      winnerSquars: null,
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquars = this.state.winnerSquars;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move (' + step.x + ', ' + step.y + ')':
        'Go to game start';
    let description;
    if (move === this.state.stepNumber) {
      description = <b>{desc}</b>;
    } else {
      description = desc;
    }
    return (
        <li key={move}>
        <button onClick={() => this.jumpTo(move)}>
        {description}
        </button>
        </li>
      );
    });

    let status;
    if (winnerSquars) {
      status = 'winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else {
      if (this.state.stepNumber === 9) {
        status = 'No one win';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
      <div className="game-board">
      <Board
      squares={current.squares}
      winnerSquars={winnerSquars}
      onClick={(i) => this.handleClick(i)}
      />

      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
    </div>
    </div>
    );
  }
}

function calculateWinner(squares) {
    const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
  );