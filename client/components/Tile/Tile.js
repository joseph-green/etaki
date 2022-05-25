import TileStyle from './Tile.module.css'
import { useDrag } from 'react-dnd'
import { useEffect, useState } from "react"
import { getEmptyImage } from 'react-dnd-html5-backend'

function FragmentTile(props) {

    const [{ isDragging }, draggableFragment, draggableFragmentPreview] = useDrag(() => ({
        type: 'fragment-available',
        item: () => {
            props.setDragging(true)
            
            return {
                id: props.frag_number,
                length: props.frag.fragment.length,
                slot: props.slot
            }
        },
        end: (item, monitor) => {
            props.setDragging(false)
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        })
      }))
    
    useEffect(() => {
        draggableFragmentPreview(getEmptyImage(), { captureDraggingState: true })
    }, [])
    
    

    

    return <div className={TileStyle.tile} ref={draggableFragment} style={{
        width: props.isMobile ? "30px" : "40px", 
        height: props.isMobile ? "30px" : "40px",
        lineHeight: props.isMobile ? "30px" : "40px",
        margin: props.isMobile ? "3px" : "5px",
    zIndex: 2}}>{props.letter}</div>
}

export default FragmentTile