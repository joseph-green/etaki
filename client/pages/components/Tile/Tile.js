import TileStyle from './Tile.module.css'
function Tile(props) {
    return <div className={TileStyle.tile}>{props.letter}</div>
}

export default Tile