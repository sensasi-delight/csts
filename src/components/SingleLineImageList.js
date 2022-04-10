import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		// overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		margin: '1em 0em'
	},
	imageList: {
		flexWrap: 'nowrap',
		// Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
		transform: 'translateZ(0)',
	},
	title: {
		color: theme.palette.primary.light,
	},
	titleBar: {
		background:
			'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
	},
}));


export default function SingleLineImageList(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<ImageList className={classes.imageList} cols={1.5} rowHeight={200}>
				{props.itemData.map((item) => (
					<ImageListItem key={item}>
						<img style={{ width: "100%", height: 'auto' }} src={"http://" + process.env.REACT_APP_API_SERVER + "/" + item} alt="Foto proses" />
						{
							!props.isDisabled &&
							<ImageListItemBar
								// title={item.title}
								classes={{
									root: classes.titleBar,
									title: classes.title,
								}}
								actionIcon={
									<IconButton aria-label="hapus" onClick={() => props.delImg(item)} >
										<DeleteForeverIcon color="secondary" />
									</IconButton>
								}
							/>
						}

					</ImageListItem>
				))}
			</ImageList>
		</div>
	);
}
