import './App.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import { React, useState, useReducer } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';



function App(props) {

    const [etaki, setEtaki] = useState(props.etaki);
    const [moveCount, updateMoveCount] = useReducer(m => m + 1, 0);
    const [moveStack, updateMoveStack] = useState([]);
    
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
            return false;
        }
        setEtaki(etaki);
        moveStack.push(fragment)
        updateMoveStack([...moveStack]);
        updateMoveCount();
        return true;
    }

    let undo = () => {
        etaki.removeFragmentFromBoard(etaki.fragments[moveStack.pop()])
        setEtaki(etaki)
        updateMoveStack([...moveStack])
        updateMoveCount();
    }

    let clearBoard = () => {
        etaki.clearBoard();
        updateMoveCount();
    }

    return [
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <h1>ETAKI {etaki.puzzle_number}</h1> 
                <Board placeFragment={placeFragment} board={etaki.renderBoard()} />
                <div className='actionMenu'>
                    <button className='clearButton' onClick={clearBoard}>Clear</button>
                     
                    <p className='moveCount'>{moveCount}</p>
                    
                    <button className='undoButton' onClick={undo}><ArrowCounterclockwise /></button>
                </div>
                <div className='fragmentList'>
                    {pieceList}
                </div>
                {etaki.complete &&
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Win</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>You win.</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary">Close</Button>
                            <Button variant="primary">Share</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                }
                

                

            </div>
        </DndProvider>
    ]
    
}

export default App;
