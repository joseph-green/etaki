import FragmentStyle from './Fragment.module.css'
import { memo, useEffect, useState } from "react"
import {  useDrag } from 'react-dnd'
import FragmentTile from '../Tile/Tile'
import { getEmptyImage } from 'react-dnd-html5-backend'


function Fragment(props){

  const [isDragging, setDragging] = useState(false);
  
  let setFragmentDragging = (state) => {
    setDragging(state)
  }
  if (!props.frag) {
    return null
  }
  const isPlaced = !(props.frag.position < 0);
  let tiles = props.frag.fragment.split("").map((ltr, slot) => {
      
      return <FragmentTile key={slot} frag={props.frag} frag_number={props.frag_number} slot={slot} setDragging={setFragmentDragging} letter={ltr} isMobile={props.isMobile} style={{zIndex: 2}}/>
      
  })

  

  return <div className={FragmentStyle.Fragment} style={{opacity: (isDragging || isPlaced) ? 0.4 : 1, margin: props.isMobile ? " 0 0.5em" : "1em", zIndex: 2}}>
          {tiles}
      </div>
    
    
}

export default Fragment