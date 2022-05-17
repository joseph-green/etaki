import TileStyle from './Tile.module.css'
function FragmentTile(props) {
    return <div className={TileStyle.tile} style={{
        width: props.isMobile ? "30px" : "40px", 
        height: props.isMobile ? "30px" : "40px",
        lineHeight: props.isMobile ? "30px" : "40px",
        margin: props.isMobile ? "3px" : "5px",
    zIndex: 2}}>{props.letter}</div>
}

export default FragmentTile