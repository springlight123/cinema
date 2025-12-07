import "./CardTimeStyle.scss";

const CardTime = ({item, movie}) => {
  return (
    <div className="card-time">
        <p className="title" style={{fontWeight:"700", color:"black", wordBreak:"break-all", marginBottom: "8px"}}>{movie?.nameMovie}</p>
      <p className="title">{`Thời gian:`} <span  style={{fontWeight:"700"}}>{item?.showTime + " - " + item?.endTime + " h"}</span></p>
      <p className="title">{`Phòng: `} <span  style={{fontWeight:"700"}}>{item?.hall}</span></p>
    </div>
  );
};

export default CardTime;
