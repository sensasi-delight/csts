import { useState } from "react";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import FullscreenDialog from "./FullscreenDialog";
import ProductTable from "./product/ListTable";
import SlaughtererTable from "./slaughterer/ListTable";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import FeaturedPlayListIcon from "@material-ui/icons/FeaturedPlayList";
import HomeIcon from "@material-ui/icons/Home";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PeopleIcon from "@material-ui/icons/People";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  barTitle: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
  },

  grow: {
    flexGrow: 1,
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  }
}));


export default function MainAppBar() {
  const classes = useStyles()

  const [uiToggle, setUiToggle] = useState({
    rightDrawer: false,
    productTable: false,
    slaughtererTable: false
  })

  const [createProductFn, setCreateProductFn] = useState()
  const [createSlaughtererFn, setCreateSlaughtererFn] = useState()



  const TitleGrid = (props) => {
    return (
      <Grid container>
        <Grid item xs={8}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props._title}
          </Typography>
        </Grid>

        <Grid container item xs={4}
          justifyContent="flex-end"
          alignItems="flex-start"
        >
          {
            props._icon &&
            <Tooltip title={props._tooltip}>
              <IconButton
                size="small"
                color='primary'
                onClick={props._onClick}
              >
                {props._icon}
              </IconButton>
            </Tooltip>
          }

          <Tooltip title="Tutup" style={{marginLeft: 8}}>
            <IconButton
              size="small"
              onClick={() => props.toggleClose()}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>

        </Grid>
      </Grid>
    )

  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" component={Link} to={''}>
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.barTitle}>
            {/* Title */}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setUiToggle({ ...uiToggle, rightDrawer: true })}
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>


      <Drawer anchor="right" open={uiToggle.rightDrawer}
        onClose={() => setUiToggle({ ...uiToggle, rightDrawer: false })}
      >
        <div style={{ width: 250 }} role="presentation">
          <List>
            <ListSubheader>Data</ListSubheader>
            <ListItem button onClick={() => setUiToggle({ ...uiToggle, productTable: true })}>
              <ListItemIcon>
                <FeaturedPlayListIcon />
              </ListItemIcon>
              <ListItemText primary="Produk" />
            </ListItem>
            <ListItem button onClick={() => setUiToggle({ ...uiToggle, slaughtererTable: true })}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Juru Sembelih" />
            </ListItem>
          </List>
        </div>
      </Drawer>


      <FullscreenDialog _isOpen={uiToggle.productTable}>
        <TitleGrid
          toggleClose={() => setUiToggle({ ...uiToggle, productTable: false })}
          _title='Daftar Produk'
          _icon={<AddCircleIcon />}
          _tooltip="Tambah"
          _onClick={createProductFn}
        />
        <ProductTable sendHandleCreate={setCreateProductFn} />
      </FullscreenDialog>

      <FullscreenDialog _isOpen={uiToggle.slaughtererTable}>
        <TitleGrid
          toggleClose={() => setUiToggle({ ...uiToggle, slaughtererTable: false })}
          _title='Daftar Penyembelih'
          _icon={<AddCircleIcon />}
          _tooltip="Tambah"
          _onClick={createSlaughtererFn}
        />

        <SlaughtererTable sendHandleCreate={setCreateSlaughtererFn} />

      </FullscreenDialog>
    </div>
  );
}
