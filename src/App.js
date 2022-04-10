import Toolbar from "@material-ui/core/Toolbar";
import MainAppBar from "./components/MainAppBar";

import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import BatchesList from "./pages/BatchesList";
import BatchDetail from "./pages/BatchDetail";
import BatchDetailCust from "./pages/BatchDetailCust";


function App() {


	return (
		<Router>
			{/* <MainAppBar /> */}
			{/* <Toolbar /> */}
			<Switch>
				<Route path="/" exact>
					<MainAppBar />
					<Toolbar />

					<BatchesList />
				</Route>

				<Route path="/batch/:batchId/:date">
					<MainAppBar />
					<Toolbar />

					<BatchDetail />
				</Route>

				<Route path="/view/batch/:batchId/:date">
				<Toolbar />

					<BatchDetailCust />
				</Route>

			</Switch>
		</Router>
	);
}

export default App;
