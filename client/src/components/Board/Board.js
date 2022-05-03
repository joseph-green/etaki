import './Board.css'
import React, { useState } from "react"
import { useDrop } from 'react-dnd'

function BoardTile(props) {
    const [weight, setWeight] = useState(0)

    const [collectedProps, droppableTile] = useDrop(() => ({
        accept: 'fragment',
        drop: (item) => {
            console.log("place in slot " + props.slot)
            if (!props.placeFragment(item.id,props.slot)) {
                console.log("could not put piece on board")
                return null
            }
            setWeight(weight + 1)

            return {
                slot: props.slot
            }
        }
      }))
    return <div className='tile' ref={droppableTile}>{props.letter}</div>
}

function Board(props) {
    console.log("board: " + props.board)
    let tiles = props.board.map((slot, i) => {
        if (slot == null) {
            return <BoardTile placeFragment={props.placeFragment} slot={i} letter={'(' + i + ')'}/>
        }
        return <BoardTile  placeFragment={props.placeFragment} slot={i} letter={slot}/>
        
    })
    return(
        <div class="Board">

            [{tiles}]

        </div> 
    )
    
}

export default Board