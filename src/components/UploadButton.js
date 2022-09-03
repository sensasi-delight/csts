import Button from "@material-ui/core/Button";
import StartIcon from "@material-ui/icons/Image";
import ApiHandler from "../classes/ApiHandler";

export default function UploadButton({ setIsImagesUploading, processObj }) {

  const handleImagesUpload = (e) => {
    setIsImagesUploading(true);

    const nImages = e.target.files.length;
    let nUploadedImage = 0;

    [...e.target.files].map(async file => {
      const formData = new FormData()
      formData.append('imgFile', file)

      return ApiHandler.uploadImage(formData)
        .then(response => response.json())
        .then(response => {

          if (!processObj.imgPaths) {
            processObj.imgPaths = []
          }

          let imgPath = response.data

          if (response.message === 'only jpg, png, and bmp are allowed') {
            imgPath = 'image/default/warning/extension_error_warning.png'
          }
          
          processObj.imgPaths.push(imgPath)
          nUploadedImage++
          if (nUploadedImage === nImages) {
            setIsImagesUploading(false)
          }
        })
    })
  }


  return (
    <Button color="primary" component="label" endIcon={<StartIcon />}>
      Tambah Foto
      <input
        accept="image/*"
        type="file"
        multiple
        onChange={handleImagesUpload}
        hidden
      />
    </Button>
  )

}