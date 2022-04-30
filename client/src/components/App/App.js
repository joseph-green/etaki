import logo from './logo.svg';
import './App.css';
import Board from '../Board/Board'
import React from 'react';


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            etaki: this.props.etaki
        }
    }

    render() {
        let pieceList = this.props.etaki.fragments.map((frag,i) => {
            return <p>[{i}][{frag.fragment}]</p>
        });
        console.log(pieceList)
        return [
            <div className="App">
                <h1>ETAKI {this.state.etaki.puzzle_number}</h1> 
                <Board />
                {pieceList}
                <p>[answer: {this.state.etaki.answer}]</p>
            </div>
        ]
    }
}

export default App;
