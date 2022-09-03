import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";


export default function SlaughtererChip({ slaughterer, onClick, isDisabled, label }) {
  
  const imgPath = slaughterer.imgPaths?.length > 0 ? slaughterer.imgPaths[0] : undefined

  const avatar = imgPath
    ? {
      avatar: <Avatar src={"http://" + process.env.REACT_APP_API_SERVER + "/" + imgPath} />
    } : {}

  return (
    <Chip
      variant="outlined"
      clickable={!isDisabled}
      onClick={onClick}
      label={label || slaughterer.name}
      style={{ margin: 2 }}
      {...avatar}
    />
  )

}