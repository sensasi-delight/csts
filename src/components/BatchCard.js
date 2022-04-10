import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	// Link,
	Typography
} from "@material-ui/core";

import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
	card: {
		display: "flex",
	},
	details: {
		display: 'flex',
		flexDirection: 'column',
	  },
	cover: {
		width: 150,
	},

	cardContent: {
		// flexGrow: 1,
		flex: '1 0 auto',
		// display: 'flex',
		//   flexDirection: 'column',
	}
}));



export default function BatchCard(props) {
	const classes = useStyles();

	return (
		<Card className={classes.card} elevation={4}>
			<CardMedia
				className={classes.cover}
				image={props.imgUrl}
				title={props.title}
			/>
			<div className={classes.details}>

				<CardContent className={classes.cardContent}>
					<Typography gutterBottom variant="h6" component="h2">
						{props.title}
					</Typography>
					{props.desc}
				</CardContent>
				<CardActions>
					<Button component={Link} size="small" color="primary" to={props.to}>
						Lihat
					</Button>
				</CardActions>
			</div>

		</Card>
	);
};