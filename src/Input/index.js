import React from "react";

import "./index.css";

const join = (...classNames) => classNames.filter(x => !!x).join(" ");

export default props =>
  <input
    type="text"
    {...props}
    className={join(props.className, "app-input")}
  />;
