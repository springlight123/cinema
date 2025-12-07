import React, { useState } from "react";
import IndexShow from "./IndexShow";
import ShowChart from "./ShowChart";

const IndexRouterShow = () => {
  const [tab, setTab] = useState(0);
  return (
    <React.Fragment>{tab === 0 ? <IndexShow setTab={setTab}/> : <ShowChart setTab={setTab} />}</React.Fragment>
  );
};

export default IndexRouterShow;
