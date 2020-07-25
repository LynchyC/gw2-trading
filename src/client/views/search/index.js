import React, { useState } from "react";

import Header from "../header";
import { Button, Container, Form, Input } from "./style";

const Search = () => {
	const [value, setValue] = useState("");

	const change = ({ target: { value } }) => setValue(value);

	return <Container>
		<Header />
		<Form>
			<Input
				element="input"
				onChange={change}
				placeholder="Item Name"
				value={value}
			/>
			<Button
				disabled={value.length < 3}
				element="button"
			>
				Get Item Data
			</Button>
		</Form>
	</Container>;

};

export default Search;