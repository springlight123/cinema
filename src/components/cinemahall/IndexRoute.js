import React, { useState } from "react";
import IndexCinemaHall from "./IndexCinemaHall";
import IndexCinemaMap from "./IndexRoomMap";
import IndexCinema from "./IndexCinema";

const IndexRouteHall = () => {
  const [tab, setTab] = useState(0);
  const [selectedIdCinema, setSelectedIdCinema] = useState(0);
  const [statusDb, setStatusDb] = useState(0);
  return (
    <React.Fragment>
      {tab === 1 && <IndexCinemaHall setTab={setTab} selectedIdCinema={selectedIdCinema}  statusDb={statusDb}/>}
      {tab === 2 && <IndexCinemaMap setTab={setTab}  selectedIdCinema={selectedIdCinema} />}
      {tab === 0 && <IndexCinema setTab={setTab} setSelectedIdCinema={setSelectedIdCinema} setStatusDb={setStatusDb} />}
    </React.Fragment>
  );
};

export default IndexRouteHall;
