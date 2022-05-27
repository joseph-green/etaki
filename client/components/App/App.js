import AppStyle from './App.module.css';
import Board from '../Board/Board'
import Fragment from '../Fragment/Fragment'
import FragmentDragLayer from '../FragmentDragLayer/FragmentDragLayer'
import { React, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { Modal, Button, ButtonGroup, Spinner, Container, Row, Col } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';
import { Etaki, easyMode, hardMode } from '../../etaki.js'
import Cookie from 'js-cookie';
import config from '../../config/default.json';
import { isMobile } from 'react-device-detect';
import { CircularProgressbar } from 'react-circular-progressbar';


function formatTime(val) {

    let hours = val >= 3600 ? Math.floor(val / 3600) : null
    let minutes = Math.floor((val % 3600) / 60)
    let seconds = Math.round(val % 60)

    
    return ((hours ? hours + ':' : "") + minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0'))
}

function App(props) {

    const [etaki, setEtaki] = useState(undefined);
    const [katieEtaki, setKatieEtaki] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isWin, setWin] = useState(false);
    const [moveCount, updateMoveCount] = useState(0);
    const [moveStack, updateMoveStack] = useState([]);
    const [showWinModal, updateShowWin] = useState(true);
    const [showInstructionModal, updateShowInstruction] = useState(true);
    const [timeToNextPuzzle, setTimeToNextPuzzle] = useState((new Date().setHours(24, 0, 0) - new Date()) / 1000);
    const [puzzleStart, setPuzzleStart] = useState(0);
    const [puzzleTime, setPuzzleTime] = useState(0);
    const [streak, setStreak] = useState(0);


    useEffect(() => {
        const url = config.apiUrl + '/'

        let cookie = Cookie.get('etaki');

        if (cookie) {
            let cookieData = JSON.parse(cookie)
            let publicEtaki = Etaki.loadEtaki(cookieData.etaki)
            let katieEtaki = Etaki.loadEtaki(cookieData.katieEtaki)
            setEtaki(publicEtaki);
            setKatieEtaki(katieEtaki);

            if (publicEtaki.complete) {
                setWin(true);
                console.log("set " + cookieData.completionTime)
                setPuzzleTime(cookieData.completionTime)
            }

            setStreak(cookieData.streak)

            updateShowInstruction(false);
            setPuzzleStart(new Date());
            setIsLoaded(true);
        }
        else {
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (data) {

                let publicEtaki = new Etaki(1, data.etaki, hardMode);
                let katieEtaki = new Etaki(1, data.katieEtaki, hardMode);

                let cookieData = {
                    etaki: JSON.stringify(publicEtaki),
                    katieEtaki: JSON.stringify(katieEtaki),
                    streak: 0

                }

                
                Cookie.set('etaki', JSON.stringify(cookieData), { expires: new Date(new Date().setHours(24, 0, 0)) })

                setEtaki(publicEtaki);
                setKatieEtaki(katieEtaki);
                setPuzzleStart(new Date());
                setIsLoaded(true);


            }).catch(function (err) {
                throw new Error("Could not get puzzle: " + err);
            });

        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            let puzzleExpiry = new Date().setHours(24, 0, 0);
            let currentTime = new Date()
            setTimeToNextPuzzle((puzzleExpiry - currentTime) / 1000)
            if (isLoaded && !(isWin || etaki.complete)) {
                setPuzzleTime(Math.floor(Math.round((currentTime - puzzleStart)) / 1000))
            }
        }, 1000)
    })



    let placeFragment = (fragment, slot) => {
        if (!etaki.addFragmentToBoard(etaki.fragments[fragment], slot)) {
            return false;
        }
        

        if (etaki.complete && !isWin) {
            setWin(true);
            setStreak(streak + 1)
            setPuzzleTime(Math.floor(Math.round((new Date() - puzzleStart)) / 1000))
            let cookieData = JSON.parse(Cookie.get('etaki'))
            cookieData.streak++;
            cookieData.etaki = etaki;
            cookieData.katieEtaki = katieEtaki;
            cookieData.completionTime = Math.floor(Math.round((new Date() - puzzleStart)) / 1000);
            Cookie.set('etaki', JSON.stringify(cookieData), { expires: new Date(new Date().setHours(24, 0, 0)) })

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
        catch (e) {
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



    if (!isLoaded || !etaki) {
        return <Spinner className={AppStyle.loadingSpinner} variant='light' animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    }

    let board = etaki.renderBoard()
    let isBoardEmpty = etaki.fragments.every((frag) => { return frag.position < 0 })

    if (isWin) {
        document.getElementById('favicon').href = "favicon_green.ico"
    }

    const dragDropBackend = isMobile ? TouchBackend : HTML5Backend
    return [
        <DndProvider backend={dragDropBackend}>
            <div className={AppStyle.App} style={{ padding: isMobile ? "1em" : 0 }}>
                <div className={AppStyle.asciiHeader} style={{
                    opacity: (etaki && etaki.complete) ? 1 : 0.7,
                    padding: isMobile ? "1em 0 1em" : "7em 0 2em"
                }}>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> ______</span><span className={AppStyle.header_T}>  ______ </span><span className={AppStyle.header_A}> ______ </span> <span className={AppStyle.header_K}> __  __</span>  <span className={AppStyle.header_I}> __</span>    </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>/\  ___\</span><span className={AppStyle.header_T}>/\__  _\</span><span className={AppStyle.header_A}>/\  __ \ </span><span className={AppStyle.header_K}>/\ \/ / </span> <span className={AppStyle.header_I}>/\ \</span>   </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>\ \  __\</span><span className={AppStyle.header_T}>\/_/\ \/</span><span className={AppStyle.header_A}>\ \  __ \</span><span className={AppStyle.header_K}>\ \  _"-.</span><span className={AppStyle.header_I}>\ \ \</span>  </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}> \ \_____\</span><span className={AppStyle.header_T}> \ \_\</span><span className={AppStyle.header_A}> \ \_\ \_\</span><span className={AppStyle.header_K}>\ \_\ \_\</span><span className={AppStyle.header_I}>\ \_\</span> </p>
                    <p className={AppStyle.asciiArt}><span className={AppStyle.header_E}>  \/_____/</span><span className={AppStyle.header_T}>  \/_/</span><span className={AppStyle.header_A}>  \/_/\/_/</span><span className={AppStyle.header_K}> \/_/\/_/</span><span className={AppStyle.header_I}> \/_/</span> </p>
                </div>
                <Board placeFragment={placeFragment} isMobile={isMobile} board={board} />
                <div className={AppStyle.actionMenu} style={{
                    margin: isMobile ? 0 : "1em auto"
                }}>
                    <ButtonGroup>
                        <Button className={AppStyle.clearButton} variant="primary" onClick={clearBoard} disabled={etaki.complete || isBoardEmpty}>Clear</Button>
                        <Button className={AppStyle.puzzleTimer} disabled={etaki.complete}>{formatTime(puzzleTime)}</Button>
                        <Button className={AppStyle.undoButton} variant="secondary" onClick={undo} disabled={etaki.complete || isBoardEmpty}><ArrowCounterclockwise /></Button>
                    </ButtonGroup>
                </div>
                {etaki ?
                    <div className={AppStyle.fragmentList} style={{
                        margin: isMobile ? 0 : "1em auto",
                        padding: isMobile ? "1em 0" : "3em 0",
                        maxWidth: isMobile ? "100%" : "50%"
                    }}>

                        {etaki.fragments.map((frag, i) => {
                            return <Fragment key={i} frag_number={i} frag={frag ? frag : null /* avoid undefined*/} isMobile={isMobile} />

                        })}
                        {
                            <FragmentDragLayer key='drag-layer' backend={dragDropBackend} fragments={etaki.fragments} isMobile={isMobile} />
                        }
                    </div>
                    : null}
                <Modal show={showInstructionModal} contentClassName={AppStyle.instructionDialog} onHide={() => { updateShowInstruction(false); }} centered>
                    <Modal.Header closeVariant='white' closeButton>
                        <Modal.Title>How To Play</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Place fragments into the slots on the board by dragging and dropping.</p>
                        <p>Fragments can overlap.</p>
                        <p>Create the secret phrase to win.</p>
                    </Modal.Body>
                </Modal>
                <Modal show={etaki && etaki.complete && showWinModal} contentClassName={AppStyle.winDialog} onHide={() => { updateShowWin(false); }} centered>
                    <Modal.Header className={AppStyle.winDialogHeader} closeVariant='white' closeButton>
                        <Container>
                            <Row>
                                <Col xs={6} md={6}>
                                    <div className={AppStyle.completionTime}>
                                        <p className={AppStyle.timeLabel}>Time: </p>
                                        <p className={AppStyle.timeValue}>{formatTime(puzzleTime)}</p>
                                    </div>
                                </Col>
                                <Col xs={6} md={6}>
                                    <div className={AppStyle.streak}>
                                        <p className={AppStyle.streakLabel}>Streak: </p>
                                        <p className={AppStyle.streakValue}>{streak}</p>
                                    </div>
                                </Col>
                            </Row>
                        
                        </Container>
                        
                    </Modal.Header>
                    <Modal.Body className={AppStyle.winDialogBody}>
                        <div className={AppStyle.progressWrapper}>
                            <CircularProgressbar value={timeToNextPuzzle} minValue={0} maxValue={86400} styles={{ path: { stroke: "#fff", strokeLinecap: 'butt', transform: 'rotate(0.75turn)', transformOrigin: 'center center'}, trail: { stroke: "#ff8b94"} }} text={""} />
                        </div>
                        <div className={AppStyle.nextPuzzle}>
                            <p className={AppStyle.nextPuzzleLabel}>Next puzzle:</p>
                            <p className={AppStyle.nextPuzzleValue}>{formatTime(timeToNextPuzzle)}</p>
                            
                        </div>
                        
                        <Button className={AppStyle.shareButton} variant="primary" style={{ display: (!navigator || !navigator.canShare || !navigator.canShare()) ? 'none' : 'block' }}>Share</Button>
                    </Modal.Body>
                </Modal>
                <div className={AppStyle.footer}>
                    <p style={{ fontSize: isMobile ? "12px" : "14px" }}>Created by <a href="https://joseph.green">Joseph Green</a></p>

                </div>
            </div>
        </DndProvider>
    ]

}

export default App;
