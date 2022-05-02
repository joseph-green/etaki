import './Fragment.css'
import React from "react"
import Tile from '../Tile/Tile'

class Fragment extends React.Component {
    render() {
        let tiles = this.props.frag.fragment.split("").map((slot, i) => {
            
            return <Tile letter={slot}/>
            
        })
        return <div className='Fragment'>
            {this.props.frag_number}: 
            {tiles}
        </div>
    }
}

export default Fragment