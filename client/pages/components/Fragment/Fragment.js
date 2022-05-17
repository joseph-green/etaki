import FragmentStyle from './Fragment.module.css'
import { memo, useEffect } from "react"
import {  useDrag } from 'react-dnd'
import FragmentTile from '../Tile/Tile'
import { getEmptyImage } from 'react-dnd-html5-backend'


function Fragment(props){
    const isPlaced = !(props.frag.position < 0);
    const [{ isDragging }, draggableFragment, draggableFragmentPreview] = useDrag(() => ({
        type: 'fragment-available',
        item: () => { 
            return {
                id: props.frag_number
            }
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging()
        })
      }))
        
    let tiles = props.frag.fragment.split("").map((slot, i) => {
        
        return <FragmentTile key={i} letter={slot} isMobile={props.isMobile} style={{zIndex: 2}}/>
        
    })

    useEffect(() => {
        draggableFragmentPreview(getEmptyImage(), { captureDraggingState: true })
      }, [])

    return <div className={FragmentStyle.Fragment} ref={draggableFragment} style={{opacity: (isDragging || isPlaced) ? 0.4 : 1, margin: props.isMobile ? " 0 0.5em" : "1em", zIndex: 1}}>
            {tiles}
        </div>
    
    
}

export default Fragment