import './Board.css'
import React, { useState } from "react"
import { useDrop } from 'react-dnd'
import '../Tile/Tile.css'
import { BorderStyle } from 'react-bootstrap-icons'

function BoardTile(props) {
    const [weight, setWeight] = useState(0)

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
    return <div className='tile BoardTile' ref={droppableTile} style={{
        borderStyle: props.weight > 0 ? "solid" : "dotted"
    }}>{props.letter}</div>
}

function Board(props) {
    let tiles = props.board.map((slot, i) => {
        return <BoardTile key={i} placeFragment={props.placeFragment} slot={i} letter={slot.letter} weight={slot.weight}/>
        
    })
    return(
        <div className="Board">
            {tiles}
        </div> 
    )
    
}

export default Board