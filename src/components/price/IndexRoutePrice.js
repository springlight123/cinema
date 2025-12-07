import React, { useState } from "react";
import IndexCustomer from "./index";
import IndexLinePrice from "./IndexLinePrice";
import IndexLinePromotion from "./IndexLinePrice";

const IndexRoutePrice = () => {
  const [tab, setTab] = useState(0);
  const [selectedIdHeader, setSelectedIdHeader] = useState(0);
  return (
    <React.Fragment>
      {tab === 0 ? (
        <IndexCustomer setTab={setTab} setSelectedIdHeader={setSelectedIdHeader} />
      ) : (
        <IndexLinePrice setTab={setTab} selectedIdHeader={selectedIdHeader} />
      )}
    </React.Fragment>
  );
};

export default IndexRoutePrice;
