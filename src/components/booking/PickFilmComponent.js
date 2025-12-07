import React, { useEffect, useState } from "react";
import "./index.scss";
import { Input, Card } from "antd";
import movieApi from "../../api/movieApi";
import { setBooking } from "../../redux/actions";
import { useDispatch } from "react-redux";

const PickFilmComponent = ({ next }) => {
  const [films, setFilms] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [searchText, setSearchText] = useState("");
  const depatch = useDispatch();
  const handleClick = (film) => {
    const resultData = { film };
    depatch(setBooking(resultData));
    next(film);
  };
  useEffect(() => {
    const getFilms = async (_id) => {
      const data = await movieApi.getMovieByType(1);
      if (data) setFilms(data);
    };
    getFilms(1);
  }, [trigger]);
  const hanleSearch = (e) => {
    if (e.target.value === "") {
      setTrigger(!trigger);
      return;
    }
    const searchFilm = async () => {
      try {
        const data = await movieApi.searchMovies(e.target.value);
     //   console.log(data)
        if (data) {
          const newData = data.filter(val => {
            return val?.status === 1
          })
          setFilms(newData);
        }
      } catch {
        setFilms([]);
      }
    };
    searchFilm();
    setSearchText(e.target.value);
  };
  return (
    <div className="pick-film">
      <Input
        className="pick-film-search"
        onChange={hanleSearch}
        placeholder="Nhập tên phim..."
      />
      ;
      {searchText ? (
        <p>
          Kết quả tìm kiếm cho: <span>{searchText}</span>
        </p>
      ) : null}
      <div className="cards">
        {films &&
          films?.map((film) => {
            return (
              <Card
                hoverable
                style={{
                  width: 240,
                  marginRight: 20,
                  marginBottom: 20,
                }}
                onClick={() => handleClick(film)}
                cover={
                  <img
                    style={{ height: "200px", objectFit: "cover" }}
                    alt="example"
                    src={film?.image}
                  />
                }
              >
                <p className="titel-film">{film?.nameMovie}</p>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default PickFilmComponent;
