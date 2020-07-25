import styled from "styled-components";

import View from "../../components/view";

export const Button = styled(View)`
	background-color: #337AB7;
	border: none;
	border-radius: 12px;
	color: #FFFFFF;
	font-size: 14px;
	justify-content: center;
	outline: none;
	padding: 6px 12px;
	&:disabled {
		background-color: #66337AB7;
		cursor: not-allowed;
	}
`;

export const Container = styled(View)`
	padding: 20px;
`;

export const Form = styled(View)`
	flex-direction: row;
`;

export const Input = styled(View)`
	border-color: #000000;	
	border-style: solid;
	border-width: 1px;
	border-radius: 5px;
	box-shadow: 0 0 1px 0 #000000 inset;
	margin-right: 5px;
	outline: none;
	padding: 6px 12px;
`;