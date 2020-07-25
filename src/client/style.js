import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

	html, body, #app {				
		box-sizing: border-box;		
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		flex-shrink: 0;		
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 16px;
		height: 100%;		
		margin: 0;
		overflow: hidden;
		padding: 0 10px;
		position: relative;
		user-select: none;
		width: 100%;
	}

`;
