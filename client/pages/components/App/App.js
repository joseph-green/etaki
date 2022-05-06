import AppStyle from './App.module.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import { React, useState, useReducer } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';



function App(props) {

    const [etaki, setEtaki] = useState(props.etaki);
    const [moveCount, updateMoveCount] = useState(0);
    const [moveStack, updateMoveStack] = useState([]);
    const [showWinModal, updateShowWin] = useState(true);
    const [showInstructionModal, updateShowInstruction] = useState(true);
    
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
        updateMoveCount(moveCount + 1);
        return true;
    }

    let undo = () => {
        etaki.removeFragmentFromBoard(etaki.fragments[moveStack.pop()])
        setEtaki(etaki)
        updateMoveStack([...moveStack])
        updateMoveCount(moveCount + 1);
    }

    let clearBoard = () => {
        etaki.clearBoard();
        updateMoveStack([]);
        updateMoveCount(moveCount + 1);
    }

    let enterKatieMode = () => {
        setEtaki(props.katieEtaki);
        updateMoveStack([]);
        updateMoveCount(0);
    }

    return [
        <DndProvider backend={HTML5Backend}>
            <div className={AppStyle.App}> 
                <div className={AppStyle.asciiHeader}>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> ______</span><span className={AppStyle.header_T}>  ______ </span><span className={AppStyle.header_A}> ______ </span> <span className={AppStyle.header_K}> __  __</span>  <span className={AppStyle.header_I}> __</span>    </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>/\  ___\</span><span className={AppStyle.header_T}>/\__  _\</span><span className={AppStyle.header_A}>/\  __ \ </span><span className={AppStyle.header_K}>/\ \/ / </span> <span className={AppStyle.header_I}>/\ </span><span className='puzzleNumber'> {etaki.puzzle_number} </span> </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>\ \  __\</span><span className={AppStyle.header_T}>\/_/\ \/</span><span className={AppStyle.header_A}>\ \  __ \</span><span className={AppStyle.header_K}>\ \  _"-.</span><span className={AppStyle.header_I}>\ \ \</span>  </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> \ \_____\</span><span className={AppStyle.header_T}> \ \_\</span><span className={AppStyle.header_A}> \ \_\ \_\</span><span className={AppStyle.header_K}>\ \_\ \_\</span><span className={AppStyle.header_I}>\ \_\</span> </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>  \/_____/</span><span className={AppStyle.header_T}>  \/_/</span><span className={AppStyle.header_A}>  \/_/\/_/</span><span className={AppStyle.header_K}> \/_/\/_/</span><span className={AppStyle.header_I}> \/_/</span> </p>
                </div>
                <Board placeFragment={placeFragment} board={etaki.renderBoard()} />
                <div className={AppStyle.actionMenu}>
                    <button className={AppStyle.clearButton} onClick={clearBoard}>Clear</button>
                    <p className={AppStyle.moveCount}>{moveCount}</p>
                    <button className={AppStyle.undoButton} onClick={undo}><ArrowCounterclockwise /></button>
                </div>
                <div className={AppStyle.fragmentList}>
                    {pieceList}
                </div>
                <Modal show={showInstructionModal} className={AppStyle.instructionDialog} onHide={() => {updateShowInstruction(false);}}>
                    <Modal.Header closeButton>
                        <Modal.Title>How To Play</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Place fragments into the slots on the board by dragging and dropping.</p>
                        <p>Fragments can overlap.</p>
                        <p>Create the secret phrase to win.</p>
                    </Modal.Body>
                </Modal>
                <Modal show={etaki.complete && showWinModal} className={AppStyle.winDialog} onHide={() => {updateShowWin(false);}}>
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
                </Modal>
                <button onClick={enterKatieMode}>KATIE MODE</button>
                
                

                

            </div>
        </DndProvider>
    ]
    
}

export default App;
