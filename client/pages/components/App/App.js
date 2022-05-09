import AppStyle from './App.module.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import { React, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { Modal, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';
import { Etaki, easyMode, hardMode } from '../../etaki'
import Cookie from 'js-cookie';
import config from '../../config/default.json';
import {isMobile} from 'react-device-detect';


function App(props) {

    

    const [etaki, setEtaki] = useState(undefined);
    const [katieEtaki, setKatieEtaki] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [moveCount, updateMoveCount] = useState(0);
    const [moveStack, updateMoveStack] = useState([]);
    const [showWinModal, updateShowWin] = useState(true);
    const [showInstructionModal, updateShowInstruction] = useState(true);
    

    useEffect(() => {
        const url = config.apiUrl + '/puzzle'

        let publicCookie = Cookie.get('public-etaki');
        let katieCookie = Cookie.get('katie-etaki');

        if (publicCookie && katieCookie) {
            setEtaki(Etaki.loadEtaki(JSON.parse(publicCookie)));
            setKatieEtaki(Etaki.loadEtaki(JSON.parse(katieCookie)));
            setIsLoaded(true);
        }
        else {
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {

                let publicEtaki = new Etaki(1,data.etaki,easyMode);
                let katieEtaki = new Etaki(1,data.katieEtaki,easyMode);

                Cookie.set('public-etaki',JSON.stringify(publicEtaki), {expires: new Date().setHours(24,0,0)})
                Cookie.set('katie-etaki',JSON.stringify(katieEtaki), {expires: new Date().setHours(24,0,0)})
                
                setEtaki(publicEtaki);
                setKatieEtaki(katieEtaki);
                setIsLoaded(true);

            
            }).catch(function(err) {
                throw new Error("Could not get puzzle: " + err);
            });

        }
      }, [])
    


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
        try {
            etaki.removeFragmentFromBoard(etaki.fragments[moveStack.pop()])
        }
        catch {
            return
        }
        
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

    if (!isLoaded) {
        return <Spinner className={AppStyle.loadingSpinner}  variant='light' animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
    }

    if (isMobile) {
        console.log("mobile")
    }
    else {
        console.log("desktop")
    }

    return [
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={AppStyle.App}> 
                <div className={AppStyle.asciiHeader} style={{opacity: (etaki && etaki.complete) ? 1 : 0.7}}>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> ______</span><span className={AppStyle.header_T}>  ______ </span><span className={AppStyle.header_A}> ______ </span> <span className={AppStyle.header_K}> __  __</span>  <span className={AppStyle.header_I}> __</span>    </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>/\  ___\</span><span className={AppStyle.header_T}>/\__  _\</span><span className={AppStyle.header_A}>/\  __ \ </span><span className={AppStyle.header_K}>/\ \/ / </span> <span className={AppStyle.header_I}>/\ \</span>   </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>\ \  __\</span><span className={AppStyle.header_T}>\/_/\ \/</span><span className={AppStyle.header_A}>\ \  __ \</span><span className={AppStyle.header_K}>\ \  _"-.</span><span className={AppStyle.header_I}>\ \ \</span>  </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> \ \_____\</span><span className={AppStyle.header_T}> \ \_\</span><span className={AppStyle.header_A}> \ \_\ \_\</span><span className={AppStyle.header_K}>\ \_\ \_\</span><span className={AppStyle.header_I}>\ \_\</span> </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>  \/_____/</span><span className={AppStyle.header_T}>  \/_/</span><span className={AppStyle.header_A}>  \/_/\/_/</span><span className={AppStyle.header_K}> \/_/\/_/</span><span className={AppStyle.header_I}> \/_/</span> </p>
                </div>
                <Board placeFragment={placeFragment} board={etaki ? etaki.renderBoard() : []} />
                <div className={AppStyle.actionMenu}>
                    <ButtonGroup>
                        <Button className={AppStyle.clearButton} variant="primary" onClick={clearBoard}>Clear</Button>
                        <Button className={AppStyle.undoButton} variant="secondary" onClick={undo}><ArrowCounterclockwise /></Button>
                    </ButtonGroup>
                </div>
                <div className={AppStyle.fragmentList}>
                    {etaki ? 
                        etaki.fragments.map((frag,i) => {
                            if (frag.position < 0) {
                                return <Fragment key={i} frag_number={i} frag={frag}/>
                            }
                            else {
                                return <span></span>
                            }
                        })
                     : ""
                }
                </div>
                <Modal show={showInstructionModal} contentClassName={AppStyle.instructionDialog} onHide={() => {updateShowInstruction(false);}}>
                    <Modal.Header closeVariant='white' closeButton>
                        <Modal.Title>How To Play</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Place fragments into the slots on the board by dragging and dropping.</p>
                        <p>Fragments can overlap.</p>
                        <p>Create the secret phrase to win.</p>
                    </Modal.Body>
                </Modal>
                <Modal show={etaki && etaki.complete && showWinModal} contentClassName={AppStyle.winDialog} onHide={() => {updateShowWin(false);}}>
                    <Modal.Header closeVariant='white' closeButton>
                        <Modal.Title>Win</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>You win.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className={AppStyle.shareButton} variant="primary">Share</Button>
                    </Modal.Footer>
                </Modal>
                <div className={AppStyle.footer}>
                    <p>Created by <a href="https://joseph.green">Joseph Green</a></p>

                </div>
                
                

                

            </div>
        </DndProvider>
    ]
    
}

export default App;
