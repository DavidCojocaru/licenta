import React from "react";
import Button from "muicss/lib/react/button";

import "./index.css";
export default props => {
  const style = {
    ...props.style
  };

  if (props.minSize) {
    style.minWidth = props.minSize === true ? 150 : props.minSize;
  }

  const cleanProps = { ...props };
  delete cleanProps.minSize;

  return <Button color="primary" {...cleanProps} style={style} />;
};
