import './Board.css'
import React, { useState } from "react"
import { useDrop } from 'react-dnd'
import '../Tile/Tile.css'

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
    return <div className='tile' ref={droppableTile} style={{fontWeight: 300 + 200 * props.weight}}>{props.letter}</div>
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