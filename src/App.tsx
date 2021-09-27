import "./App.css";
import { BrowserRouter as Switch, Route } from "react-router-dom"
import Resizable from "./components/Resizable";
import Draggable from "./components/Draggable";

function App() {

	return (
		<>
			<Switch>
				<Route path="/resizable" exact >
					<Resizable />
				</Route>
				<Route path="/draggable" exact>
					<Draggable />
				</Route>
			</Switch>
		</>
	);
}

export default App;
