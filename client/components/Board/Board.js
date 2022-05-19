import BoardStyle from './Board.module.css'
import React, { useState } from "react"
import { useDrop } from 'react-dnd'
import { BorderStyle } from 'react-bootstrap-icons'
import { Overlay } from 'react-bootstrap'

function BoardTile(props) {
    const [weight, setWeight] = useState(0)
    const overlapColors = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94']

    const [collectedProps, droppableTile] = useDrop(() => ({
        accept: 'fragment-available',
        drop: (item) => {
            if (!props.placeFragment(item.id,props.slot)) {
                return null
            }
            setWeight(weight + 1)

            return {
                slot: props.slot
            }
        }
      }))
    return <div className={BoardStyle.BoardTile} ref={droppableTile} style={{
        opacity: props.weight > 0 ? "100%" : "70%",
        backgroundColor: props.weight > 1 ? overlapColors[props.weight - 2] : "#818184",
        width: props.isMobile ? "30px" : "40px", 
        height: props.isMobile ? "30px" : "40px",
        lineHeight: props.isMobile ? "30px" : "40px",
        margin: props.isMobile ? "3px" : "5px",
        zIndex: 1
    }}> {props.letter}</div>
}

function Board(props) {

    if (!props.board) {
        return null
    }
    
    let tiles = props.board.map((slot, i) => {
        return <BoardTile key={i} placeFragment={props.placeFragment} slot={i} letter={slot.letter} weight={slot.weight} isMobile={props.isMobile}/>
        
    })
    return(
        <div className={BoardStyle.Board} style={{
            width: props.isMobile ? "100%" : "50%",
            padding: props.isMobile ? "0.5em 0.1em" : "3em 0"
        }}>
            {tiles}
        </div> 
    )
    
}

export default Board