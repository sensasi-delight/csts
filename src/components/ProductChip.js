import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";


export default function ProductChip({ product, onClick, isDisabled, label }) {
  
  const imgPath = product.imgPaths?.length > 0 ? product.imgPaths[0] : product.imgPath

  const avatar = imgPath
    ? {
      avatar: <Avatar src={"http://" + process.env.REACT_APP_API_SERVER + "/" + imgPath} />
    } : {}

  return (
    <Chip
      key={product.id}
      variant="outlined"
      clickable={!isDisabled}
      onClick={onClick}
      label={label || product.name}
      style={{ margin: 2 }}
      {...avatar}
    />
  )

}