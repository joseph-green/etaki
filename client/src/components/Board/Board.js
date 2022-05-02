import './Board.css'
import React from "react"
import Tile from '../Tile/Tile'


class Board extends React.Component {

    render() {
        let tiles = this.props.board.map((slot, i) => {
            if (slot == null) {
                return <Tile letter={'(' + i + ')'}/>
            }
            return <Tile letter={slot}/>
            
        })
        return(
            <div class="Board">

                [{tiles}]

            </div> 
        )
    }
}

export default Board