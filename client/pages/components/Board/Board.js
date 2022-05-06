import BoardStyle from './Board.module.css'
import React, { useState } from "react"
import { useDrop } from 'react-dnd'
import { BorderStyle } from 'react-bootstrap-icons'

function BoardTile(props) {
    const [weight, setWeight] = useState(0)
    const overlapColors = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94']

    const [collectedProps, droppableTile] = useDrop(() => ({
        accept: 'fragment',
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
        backgroundColor: props.weight > 1 ? overlapColors[props.weight - 2] : "#818184"
    }}>{props.letter}</div>
}

function Board(props) {
    let tiles = props.board.map((slot, i) => {
        return <BoardTile key={i} placeFragment={props.placeFragment} slot={i} letter={slot.letter} weight={slot.weight}/>
        
    })
    return(
        <div className={BoardStyle.Board}>
            {tiles}
        </div> 
    )
    
}

export default Board