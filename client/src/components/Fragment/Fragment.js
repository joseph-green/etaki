import './Fragment.css'
import React from "react"
import { useDrag } from 'react-dnd'
import Tile from '../Tile/Tile'

function Fragment(props){
    const [{ isDragging }, draggableFragment] = useDrag(() => ({
        type: 'fragment',
        item: () => { 
            console.log("select fragment " + props.frag_number)
            return {
                id: props.frag_number
            }
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }))
        
    let tiles = props.frag.fragment.split("").map((slot, i) => {
        
        return <Tile letter={slot}/>
        
    })
    return <div className='Fragment' ref={draggableFragment}>
        {props.frag_number}: 
        {tiles}
    </div>
    
}

export default Fragment