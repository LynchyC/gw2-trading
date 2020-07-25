import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Search from "./views/search";
import Style from "./style";


const App = () => {
	return <BrowserRouter>
		<Fragment>
			<Switch>
				<Route component={Search} path="/" />
			</Switch>
			<Style />
		</Fragment>
	</BrowserRouter>;
}

render(<App />, document.getElementById("app"));