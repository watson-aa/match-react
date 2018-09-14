import React from 'react';
import ReactDOM from 'react-dom';
import { getEmojis } from './emoji.js';
import './index.css';

/* The number of rows and columns of cards on the table.  The multiplier should be even.
    Remember, this is a matching game! */
const tableSize = [6,6];

/* A random selection of emoji's shuffled into an array.  There will be two of each.  
    Check out emoji.js for details. */
let emojis = getEmojis((tableSize[0] * tableSize[1]) / 2);

// A simple card.  It has a front, a back, and a flip state
function Card(props) {
    return (
        <div className={props.flipped ? 'card flipped': 'card unflipped'}  
            onClick={props.onClick}
        >
            <div className="front"></div>
            <div className="back">
                {props.value}
            </div>
        </div>
    );
}    


class Table extends React.Component {
    renderCard(i) {
        return ( 
            <Card 
                key={i}
                value={emojis[i]}
                flipped={this.props.flipped[i]}
                onClick={() => this.props.onClick(i, emojis[i])}
            />
        );
    }

    // Let's lay all of our cards on the table
    createTable = () => {
        let table = [];
        let counter = 0;
    
        for (let x = 0; x < tableSize[0]; x++) {
            let row = [];
            for (let y = 0; y < tableSize[1]; y++) {
                row.push(this.renderCard(counter));
                counter++;
            }
            table.push(<div className="table-row" key={x}>{row}</div>);
        }
    
        return table;
    }
    
    render() {
        return (
            <div>
                {this.createTable()}
            </div>        
        );
    }
}


/* Where the magic happens.  
    State properties:
        turns - the number of turns that have occurred in the current game.  A turn is the act of flipping two cards
        compare - the value of the last card turned.  How else will we know if we have match?
        turn - a two position array containing the keys of the cards involved in the current turn
        flipped - a table-sized array of booleans indicating which cards have been turned over
        matched - an array containing a single instance of the matched emojis, so far.  The game is over when all emojis are represented in this array.
*/
class Game extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            turns: 0,
            compare: null,
            turn: Array(2).fill(null),
            flipped: Array(tableSize[0] * tableSize[1]).fill(false),
            matched: []
        };
    }

    render() {
        return (
            <div>
                <div style={{float: 'left', padding: '1em'}}>
                    <Table
                        flipped={this.state.flipped}
                        onClick={(key, value) => this.handleClick(key, value)}
                    />
                    <div style={{paddingTop: '1em'}}>
                        <b>Turns:</b> {this.state.turns}
                    </div>
                    <div>
                        <b>Matches:</b> {this.state.matched.length}
                    </div>
                    <div style={{display: this.state.matched.length === (this.state.flipped.length / 2) ? 'block' : 'none'}}>
                        <b>You Win!</b>
                    </div>
                </div>
                <div style={{float: 'left', textAlign: 'center'}}>
                    <div>
                        <button
                            className='actionButton green' 
                            disabled={this.state.turn[1] == null} 
                            onClick={() => this.resetTurn()}>
                            Try Again
                        </button>
                    </div>
                    <div>
                        <button
                            className='actionButton red' 
                            onClick={() => this.resetGame()}>
                            Reset Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    /* Imagine this: you have turned over two cards and they are not a match.  Now, it's time to turn 
        them back over and try again.  In that scenario, this function is your friend.
        Flips the cards referenced in the state.turn array and reinits state.turn. */
    resetTurn() {
        let turn = this.state.turn;
        let flipped = this.state.flipped.slice();

        flipped[turn[0]] = false;
        flipped[turn[1]] = false;
        turn = Array(2).fill(null);

        this.setState( {
            turn: turn,
            flipped: flipped
        });
    }

    /* Giving up or winning.  They are all the same to this function.
        Generates a new array of emojis and resets the game state. */
    resetGame() {
        this.setState({
            turns: 0,
            compare: null,
            turn: Array(2).fill(null),
            flipped: Array(tableSize[0] * tableSize[1]).fill(false),
            matched: []            
        });

        setTimeout(() => {
            emojis = getEmojis((tableSize[0] * tableSize[1]) / 2);
        }, 600);
    }

    // When a card is flipped, everything changes.
    handleClick(key, value) {
        // last turn is not over or we've already matched this emoji; don't bother...
        if (this.state.turn[1] !== null || this.state.matched.indexOf(value) >= 0) {
            return false;
        }

        let turns = this.state.turns;
        let compare = this.state.compare;
        let turn = this.state.turn;
        let flipped = this.state.flipped.slice();
        let matched = this.state.matched.slice();

        flipped[key] = true;

        if (turn[0] == null) {
            compare = value;
            turn[0] = key;
        } else {
            turns++;

            if (compare === value) {
                matched.push(value);
                turn = Array(2).fill(null);
            } else {
                turn[1] = key;
            }

            compare = null;         
        }

        this.setState({
            turns: turns,
            compare: compare,
            turn: turn,
            flipped: flipped,
            matched: matched
        });
    }
}


ReactDOM.render(
    <Game />, 
    document.getElementById('root')
);
