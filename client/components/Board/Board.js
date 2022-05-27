import BoardStyle from './Board.module.css'
import React, { useEffect, useState } from "react"
import { useDrop } from 'react-dnd'

function BoardTile(props) {
    const [weight, setWeight] = useState(0)
    
    const overlapColors = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94']

    const [{ isOver, dropResult }, droppableTile] = useDrop(() => ({
        accept: 'fragment-available',
        drop: (item) => {
            props.boardHover(-1,-1)
            if (!props.placeFragment(item.id,props.slot - item.slot)) {
                return null
            }
            setWeight(weight + 1)

            return {
                slot: props.slot
            }
        },
        hover: (item, monitor) => {
            let fragStart = props.slot - item.slot
            props.boardHover(fragStart, fragStart + item.length)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            dropResult: monitor.getDropResult()
        })
      }))
    
      useEffect(() => {
          console.log(dropResult)
          if (dropResult) {
            props.boardHover(-1,-1)
          }
      },
      [dropResult])
    return <div className={BoardStyle.BoardTile} ref={droppableTile} style={{
        opacity: props.weight > 0 ? "100%" : "70%",
        backgroundColor: props.weight > 1 ? overlapColors[props.weight - 2] : "#818184",
        width: props.isMobile ? "30px" : "40px", 
        height: props.isMobile ? "30px" : "40px",
        lineHeight: props.isMobile ? "30px" : "40px",
        margin: props.isMobile ? "3px" : "5px",
        boxShadow: isOver || props.isHovered ? '3px 3px 2px #fff' : 'none',
        zIndex: 1
    }}> {props.letter}</div>
}

function Board(props) {

    const [hoverStart, setHoverStart] = useState(-1)
    const [hoverEnd, setHoverEnd] = useState(-1)

    let boardHover = (hovStart, hovEnd) => {
        setHoverStart(hovStart)
        setHoverEnd(hovEnd)
    }

    const [{ isOver }, droppableBoard] = useDrop(() => ({
        accept: 'fragment-available',
        drop: (item, monitor) => {
            if (monitor.didDrop()) {
                boardHover(-1,-1)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
      }))
    


    if (!props.board) {
        return null
    }
    
    useEffect(() => {
        if (!isOver) {
            boardHover(-1,-1)
        }
    }, [isOver])

    let tiles = props.board.map((slot, i) => {
        return <BoardTile key={i} placeFragment={props.placeFragment} slot={i} letter={slot.letter} weight={slot.weight} isMobile={props.isMobile} boardHover={boardHover} isHovered={i >= hoverStart && i < hoverEnd}/>
        
    })
    return(
        <div className={BoardStyle.Board} ref={droppableBoard} style={{
            width: props.isMobile ? "100%" : "50%",
            padding: props.isMobile ? "0.5em 0.1em" : "3em 0"
        }}>
            {tiles}
        </div> 
    )
    
}

export default Board