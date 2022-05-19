import FragmentStyle from '../Fragment/Fragment.module.css'
import React from "react"
import { useDragLayer } from 'react-dnd'
import FragmentTile from '../Tile/Tile'


function FragmentDragLayer(props){
    const {itemType, isDragging, item, currentOffset} = useDragLayer((monitor) => {
        
        return {
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
        }
      })

    if (!item || !currentOffset) {
        return null
    }
    
    let tiles = props.fragments[item.id].fragment.split("").map((slot, i) => {
        
        return <FragmentTile key={i} letter={slot} isMobile={props.isMobile}/>
        
    })

    return <div className={FragmentStyle.Fragment} style={{
            position: 'absolute',
            left: currentOffset.x,
            top: currentOffset.y,
            margin: props.isMobile ? " 0 0.2em" : "1em",
            zIndex: 0
            }}>
            {tiles}
        </div>
    
    
}

export default FragmentDragLayer