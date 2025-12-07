import React, { useState } from "react";
import IndexBooking from "./IndexBooking";

const IndexRouteBooking = () => {
  const [tab, setTab] = useState(0);
  return (
    <React.Fragment>
      {tab === 0 ? (
        <IndexBooking setTab={setTab} />
      ) : (
        // <IndexCinemaMap setTab={setTab} />
        <div></div>
      )}
    </React.Fragment>
  );
};

export default IndexRouteBooking;
