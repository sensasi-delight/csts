import { forwardRef } from "react";
import { Button, Grid, makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import Container from '@material-ui/core/Container';

import CircularProgress from '@material-ui/core/CircularProgress';




const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},

	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},

	content: {
		paddingTop: theme.spacing(4)
	},

	btnBox: {
		marginTop: theme.spacing(4)
	}
}));



const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullscreenDialog(props) {
	const classes = useStyles();

	const {
		_title,
		_isForm,
		_isOpen,

		_handleCloseForm,
		_isSubmitDisabled,
		_handleSubmit

	} = props

	return (
		<Dialog fullScreen open={_isOpen} TransitionComponent={Transition}>
			{_isForm &&
				<>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								{_title}
							</Typography>
							<IconButton
								color="inherit"
								onClick={_handleCloseForm}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
						</Toolbar>
					</AppBar>
					<DialogContent className={classes.content}>
						<Container maxWidth="sm">

							{
								props.isLoading ? <CircularProgress /> :
									<>
										{props.children}
										{!_isSubmitDisabled &&
											<Grid container className={classes.btnBox} justifyContent="flex-end">
												<Button
													disabled={_isSubmitDisabled}
													onClick={_handleSubmit}
													color="primary"
													variant="contained"
												>
													Simpan
												</Button>
											</Grid>
										}
									</>
							}
						</Container>
						<Toolbar />

					</DialogContent>
				</>

			}

			{!_isForm &&
				<>
					<Toolbar />
					<Container maxWidth="lg">
						{props.children}
					</Container>
					<Toolbar />
					<Toolbar />
				</>

			}
		</Dialog>
	);
}
