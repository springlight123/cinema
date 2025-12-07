import { useEffect, useState } from "react";
import cinameApi from "../../api/cinemaApi";
import movieApi from "../../api/movieApi";
import showApi from "../../api/showApi";
import { useSelector } from "react-redux";
import moment from "moment";
import { Form } from "antd";
import { getFilmById } from "../../services/FilmService";
const dateFormat = "YYYY-MM-DD";
const arr = [0, 1, 2, 3, 4, 5, 6];
const useShowChartHook = () => {
  const [listMovie, setListMovie] = useState([]);
  const [listCinema, setListCinema] = useState([]);
  const [dataTimes, setDataTimes] = useState([]);
  const [idMovie, setIdMovie] = useState(-1);
  const [idCinemaPayLoad, setIdCinemaPayLoad] = useState(-1);
  const cinema = useSelector((state) => state.cinema);
  const [movie, setMovie] = useState();
  const [form] = Form.useForm();
  const [dateAmount, setDateAmount] = useState(0)
  const [datePicker, setDatePicker] = useState()
  
  const handleChange = (value) => {
    setIdMovie(value);
  };

  const handleChangeCinema = (value) => {
    setIdCinemaPayLoad(value);
  };
  useEffect(() => {
    const getListShow = async (date) => {
      try {
        const response = await showApi.getShowByDate({
          idCinema: 1,
          idMovie: idMovie,
          showDate: date,
        });
        if (response) {
          return response;
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    const promise = arr.map((i) => {
      let date;
      if(dateAmount === 0) {
        date = moment()
        .startOf("week")
        .add(i + 1, "days")
        .format(dateFormat);
      }
      else if( dateAmount > 0) {
        date = moment()
        .startOf("week")
        .add(i + 1 + dateAmount, "days")
        .format(dateFormat);
      }
      else if( dateAmount < 0) {
        date = moment()
        .startOf("week")
        .add(i + 1 - dateAmount, "days")
        .format(dateFormat);
      }
      const data = getListShow(date);
      return data;
    });
    Promise.all([...promise]).then((values) => {
      setDataTimes(values);
    });
  }, [idCinemaPayLoad, idMovie, dateAmount]);

  useEffect(() => {
    const fetchCinema = async () => {
      const res = await cinameApi.getCinemaActive();
      if (res) {
        const data = res.map((item, index) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setListCinema(data);
      }
    };
    const fetchMovie = async () => {
      const res = await movieApi.getMovieByType(1);
      if (res) {
        const data = res.map((item, index) => {
          return {
            value: item.id,
            label: item.nameMovie,
          };
        });
        setIdMovie(data[0]?.value);
        setListMovie(data);
      }
    };
    setIdCinemaPayLoad(cinema?.id);
    fetchMovie();
    fetchCinema();
  }, []);

  useEffect(() => {
    getFilmById(idMovie).then((data) => {
      setMovie(data);
    });
  }, [idMovie]);

  useEffect(() => {
    form.setFieldsValue({
      moviePick: listMovie[0]?.value
    });
  }, [listMovie]);

  const handleChangeDate = (value) => {
    if(value === 0) {
      setDateAmount(0)
    } else if( value === 1) {
      setDateAmount(dateAmount - 7)
    } else if( value === 2) {
      setDateAmount(dateAmount + 7)
    }
  }

  const handeChangeDatePicker = (value) => {
    const current =  moment().day()
    console.log( current.diff(value, 'days'))
    setDatePicker(value.format(dateFormat))
  }

  return {
    listMovie,
    listCinema,
    cinema,
    handleChange,
    handleChangeCinema,
    dataTimes,
    movie,
    form,
    handleChangeDate,
    dateAmount,
    handeChangeDatePicker
  };
};

export default useShowChartHook;
