import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '0px',
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    // overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    margin: '1em 0em'
  },
  imageList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  item: {
    opacity: 1,
    transition: '.5s ease',
    '&:hover': {
      opacity: .7,
    },
    cursor: 'pointer',
  },
  // title: {
  //   color: theme.palette.primary.light,
  // },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

export default function SingleLineImageList({ isDisabled, processObj, setProcess }) {

  const [imgPath, setImgPath] = useState();
  const [isOpenImg, setIsOpenImg] = useState(false);

  const handleDeleteImage = (imgPath) => {
    processObj.imgPaths?.splice(processObj.imgPaths?.findIndex(el => el === imgPath), 1)
    // TODO: also delete image on server
    return setProcess({ ...processObj })
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImageList className={classes.imageList} rowHeight={200}>
        {
          processObj.imgPaths?.map(imgPath => (
            <ImageListItem key={imgPath} style={{
              width: '204px'
            }}>
              <div
                className={classes.item}
                style={{
                  backgroundImage: `url('http://${process.env.REACT_APP_API_SERVER}/${imgPath}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed',
                  backgroundPosition: 'center center',
                  backgroundSize: 'cover',
                  height: '100%',
                  width: '100%',
                }}

                onClick={() => {
                  setImgPath(imgPath);
                  setIsOpenImg(true)
                }}

              />
              {
                !isDisabled &&
                <ImageListItemBar
                  // title={item.title}
                  classes={{
                    root: classes.titleBar,
                    // title: classes.title,
                  }}
                  actionIcon={
                    <IconButton aria-label="hapus" onClick={() => handleDeleteImage(imgPath)} >
                      <DeleteForeverIcon color="secondary" />
                    </IconButton>
                  }
                />
              }

            </ImageListItem>
          ))
        }
      </ImageList>

      <Dialog maxWidth="lg" open={isOpenImg} onClose={() => setIsOpenImg(false)}>
        <IconButton aria-label="close" style={{
          position: 'absolute',
          right: '.3em',
          top: '.3em',
          color: '#FAFAFA',
        }} onClick={() => setIsOpenImg(false)}>
          <CloseIcon />
        </IconButton>

        <DialogContent style={{ padding: 0 }}>
          <img width="100%" src={"http://" + process.env.REACT_APP_API_SERVER + "/" + imgPath} alt="Foto Proses" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
