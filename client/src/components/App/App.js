import './App.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import React from 'react';



class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            etaki: this.props.etaki,
            selectedPiece: 0,
            selectedSlot: 0
        }

        this.handleSelectPiece = this.handleSelectPiece.bind(this)
        this.handleSelectSlot = this.handleSelectSlot.bind(this)
        this.handlePlace = this.handlePlace.bind(this)
        this.state.etaki.clearBoard()
        
    }

    handleSelectPiece(e) {
        this.setState({selectedPiece: Number(e.target.value)})
        console.log("select piece " + Number(e.target.value))
    }

    handleSelectSlot(e) {
        this.setState({selectedSlot: Number(e.target.value)})
        console.log("select slot " + Number(e.target.value))
    }

    handlePlace(e) {
        console.log("place")
        let fragment = this.state.etaki.fragments[this.state.selectedPiece]
        this.state.etaki.addFragmentToBoard(fragment,this.state.selectedSlot)
        this.setState({state: this.state})

    }

    render() {
        let pieceList = this.props.etaki.fragments.map((frag,i) => {
            if (frag.position < 0) {
                return <Fragment key={i} frag_number={i} frag={frag}/>
            }
            else {
                return <span></span>
            }
        });

        let winState = this.state.etaki.complete ? "Yes" : "No";
        console.log(pieceList)
        return [
            <div className="App">
                <h1>ETAKI {this.state.etaki.puzzle_number}</h1> 
                <Board board={this.state.etaki.renderBoard()} />
                {pieceList}
                Put piece: <input onChange={this.handleSelectPiece} type='number' name='fragment'></input>
                to: <input onChange={this.handleSelectSlot} type='number' name='fragment'></input>
                <button onClick={this.handlePlace}>Place</button>

                
                <p>Win?: {winState}</p>

            </div>
        ]
    }
}

export default App;
