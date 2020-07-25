import { node, oneOfType, object, string } from "prop-types";
import React, { forwardRef } from "react";

import Container from "./style";

const Component = ({ children, element, innerRef, ...otherProps }) => {
	return <Container
		{...otherProps}
		as={element}
		ref={innerRef}
	>
		{children}
	</Container>
};

Component.defaultProps = {
	children: null,
	element: "div",
	innerRef: null
};

Component.propTypes = {
	children: node,
	element: string,
	innerRef: oneOfType([node, object])
};

export default forwardRef((props, ref) => {
	return <Component {...props} innerRef={ref} />
});