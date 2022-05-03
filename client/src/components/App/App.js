import './App.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import { React, useState, useReducer } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'



function App(props) {

    const [etaki, setEtaki] = useState(props.etaki);
    const [moveCount, updateMoveCount] = useReducer(m => m + 1, 0);
    
    let pieceList = etaki.fragments.map((frag,i) => {
        if (frag.position < 0) {
            return <Fragment key={i} frag_number={i} frag={frag}/>
        }
        else {
            return <span></span>
        }
    });

    let placeFragment = (fragment,slot) => {
        if (!etaki.addFragmentToBoard(etaki.fragments[fragment],slot)) {
            console.log("placeFragment fail");
            return false;
        }
        setEtaki(etaki);
        console.log("movecount " + moveCount)
        updateMoveCount();
        console.log("placeFragment success")
        return true;
    }

    let clearBoard = () => {
        etaki.clearBoard();
        updateMoveCount();
    }

    let winState = etaki.complete ? "Yes" : "No ";
    console.log("render")
    return [
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <h1>ETAKI {etaki.puzzle_number}</h1> 
                <Board placeFragment={placeFragment} board={etaki.renderBoard()} />
                {pieceList}

                <button onClick={clearBoard}>Clear Board</button>
                <p>Move Count: {moveCount}</p>
                <p>Win?: {winState}</p>

            </div>
        </DndProvider>
    ]
    
}

export default App;
