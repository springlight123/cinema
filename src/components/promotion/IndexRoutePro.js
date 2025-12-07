import React, { useState } from "react";
import IndexLinePromotion from "./IndexLinePromotion";
import IndexPromotion from "./IndexPromotion";

const IndexRoutePro = () => {
  const [tab, setTab] = useState(0);
  return (
    <React.Fragment>
      {tab === 0 ? (
        <IndexPromotion setTab={setTab} />
      ) : (
        <IndexLinePromotion setTab={setTab} />
      )}
    </React.Fragment>
  );
};

export default IndexRoutePro;
