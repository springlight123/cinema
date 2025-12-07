import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Upload,
  message,
  Popover,
  Checkbox,
  Table,
} from "antd";

import { PlusOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import movieApi from "../../api/movieApi";
import cinameApi from "../../api/cinemaApi";
import showTimeApi from "../../api/showTimeApi";
import moment from "moment/moment";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import showApi from "../../api/showApi";

const { Option } = Select;

const ModelAddShow = ({ showModalAddCustomer, setShowModalAddCustomer }) => {
  const [listMovie, setListMovie] = useState([]);
  const [moviePicked, setMoviePicked] = useState("");
  const [listCinema, setListCinema] = useState([]);
  const [cinemaPicked, setCinemaPicked] = useState("");
  const [listHall, setListHall] = useState([]);
  const [hallPicked, setHallPicked] = useState("");
  const [listTime, setListTime] = useState([]);
  const [timePicked, setTimePicked] = useState([]);
  const [startDatePicked, setStartDatePicked] = useState("");
  const [durationPicked, setDurationPicked] = useState(0);
  const [durationString, setDurationString] = useState("");
  const [status, setStatus] = useState("");
  const [endDatePicked, setEndDatePicked] = useState("");
  const [startDateMovie, setStartDateMovie] = useState("");
  const [endDateMovie, setEndDateMovie] = useState("");

  const { RangePicker } = DatePicker;

  const [form] = Form.useForm();

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [listShowDuplicate, setListShowDuplicate] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [listTimePassed, setListTimePassed] = useState([]);
  const [endDateMoviePicked, setEndDateMoviePicked] = useState("");

  const columns = [
    {
      title: "Mã lịch chiếu",
      dataIndex: "idShow",
    },
    {
      title: "Mã phim",
      dataIndex: "codeMovie",
    },
    {
      title: "Tên phim",
      dataIndex: "nameMovie",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
    },
    {
      title: "Từ giờ",
      dataIndex: "startTime",
    },
    {
      title: "Đến giờ",
      dataIndex: "endTime",
    },
  ];

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  //handle submit form create new customer...
  const handleSubmit = async (values) => {
    const payload = {
      startDate: startDatePicked,
      endDate: endDatePicked,
      showTime: timePicked,
      idCinemaHall: values.hall,
      idMovie: values.movie,
      idCinema: values.cinema,
    };

    console.log("payload", payload);

    try {
      const res = await showApi.createShow(payload);
      if (res) {
        message.success("Thêm lịch chiếu thành công");
        setShowModalAddCustomer(false);
        depatch(setReload(!reload));
      }
    } catch (error) {
      console.log("error", error);
      const { data } = error.response;
      if (data) {
        message.error(
          data.message +
            "! Vui lòng chọn vào nút xem lịch trùng để xem chi tiết"
        );
      }
    }
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    setStartDatePicked(dateString[0]);
    setEndDatePicked(dateString[1]);
  };

  const onChangeDateEnd = (date, dateString) => {};

  const onChangeMovie = async (value) => {
    setMoviePicked(value);
    const { duration, releaseDate, endDate } = await movieApi.getMovieById(
      value
    );
    setEndDateMoviePicked(moment(endDate).format("YYYY-MM-DD"));
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const durationString = `${hours} giờ ${minutes} phút`;
    setDurationString(durationString);
    setStartDateMovie(dayjs(releaseDate).format("YYYY-MM-DD"));
    setEndDateMovie(dayjs(endDate).format("YYYY-MM-DD"));
    if (
      dayjs(releaseDate).format("YYYY-MM-DD") < dayjs().format("YYYY-MM-DD")
    ) {
      form.setFieldsValue({
        date: [dayjs().add("1", "day"), dayjs(endDate)],
      });
      setStartDatePicked(dayjs().add("1", "day").format("YYYY-MM-DD"));
      setEndDatePicked(dayjs(endDate).format("YYYY-MM-DD"));
    } else {
      form.setFieldsValue({
        date: [dayjs(releaseDate), dayjs(endDate)],
      });
      setStartDatePicked(dayjs(releaseDate).format("YYYY-MM-DD"));
      setEndDatePicked(dayjs(endDate).format("YYYY-MM-DD"));
    }
  };

  const disabledDate = (current) => {
    return (
      (current && current < dayjs(startDateMovie)) ||
      current > dayjs(endDateMovie).endOf("day") ||
      current < dayjs().endOf("day")
    );
  };

  const onChangeCinema = (value) => {
    console.log(`selected ${value}`);
    setCinemaPicked(value);
  };

  const onChangeHall = (value) => {
    console.log(`selected ${value}`);
    setHallPicked(value);
  };

  const onChangeTime = async (value) => {
    // console.log("value", value);
    const { duration } = await movieApi.getMovieById(moviePicked);
    if (!duration) {
      message.error("Vui lòng chọn phim trước");
      setTimePicked([]);
      return;
    } else {
      setTimePicked(value);
    }
  };

  const checkShowDuplicate = async () => {
    setIsModalOpen(true);
    const payload = {
      startDate: startDatePicked,
      endDate: endDatePicked,
      showTime: timePicked,
      idCinemaHall: hallPicked,
      idMovie: moviePicked,
      idCinema: cinemaPicked,
    };
    try {
      const res = await showApi.checkShowIsExist(payload);
      if (res.length === 0) {
        setListShowDuplicate([]);
      }
    } catch (error) {
      const { data } = error.response;
      if (data) {
        const list = data.data.map((item) => {
          return {
            idShow: item.idShow,
            codeMovie: item.Show.Movie.codeMovie,
            nameMovie: item.Show.Movie.nameMovie,
            showDate: item.showDate,
            startTime: item.ShowTime.showTime,
            endTime: item.endTime,
            code: item.Show.code,
          };
        });
        setListShowDuplicate(list);
      }
    }
  };

  const onChangeCheck = (e) => {
    setIsCheck(e.target.checked);
  };

  useEffect(() => {
    const getShowIsPass = async () => {
      try {
        const res = await showApi.getShowIsPass({
          startDate: startDatePicked,
          endDate: endDatePicked,
          idCinema: cinemaPicked,
          idCinemaHall: hallPicked,
          idMovie: moviePicked,
        });
        if (res.length > 0) {
          const list = res.map((item) => {
            return {
              value: item.id,
              label: item.showTime,
            };
          });
          setListTimePassed(list);
        } else {
          setListTimePassed([]);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    if (
      isCheck &&
      cinemaPicked &&
      hallPicked &&
      moviePicked &&
      startDatePicked &&
      endDatePicked
    ) {
      getShowIsPass();
    }
  }, [
    isCheck,
    cinemaPicked,
    hallPicked,
    moviePicked,
    startDatePicked,
    endDatePicked,
  ]);

  // fetch list movies
  useEffect(() => {
    //load movies
    const getMovies = async () => {
      try {
        const response = await movieApi.getMovieByType(1);
        if (response) {
          const arrMovie = response.map((item) => {
            return {
              value: item.id,
              label: item.nameMovie,
            };
          });
          setListMovie(arrMovie);
        }
      } catch (error) {
        console.log("Failed to fetch movies list: ", error);
      }
    };

    const getCinemas = async () => {
      try {
        const response = await cinameApi.getCinemaActive();

        console.log(response);
        //set user info
        if (response) {
          const newArr = response.map((val) => {
            return { value: val.id, label: val.name };
          });

          setListCinema(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    getCinemas();
    getMovies();
  }, []);

  useEffect(() => {
    const getTimes = async () => {
      try {
        const response = await showTimeApi.getListShowTime();
        const res = await showApi.getShowIsPass({
          startDate: startDatePicked,
          endDate: endDatePicked,
          idCinema: cinemaPicked,
          idCinemaHall: hallPicked,
          idMovie: moviePicked,
        });
        const { duration } = await movieApi.getMovieById(moviePicked);
        if (response && res) {

          let arrTime = [];
          for (let i = 0; i < response.length; i++) {
            const options = {
              value: response[i].id,
              label: response[i].showTime,
            };
            arrTime.push(options);
          }

          
          let arrTimePassed = [];
          for (let i = 0; i < res.length; i++) {
            const options = {
              value: res[i].id,
              label: res[i].showTime,
            };
            arrTimePassed.push(options);
          }
          const timePic = timePicked[timePicked.length - 1];
        // console.log("res", res);


          if (isCheck && arrTimePassed.length > 0) {
            const index = arrTimePassed.findIndex((item) => item.value === timePic);
            // console.log("index--", index);
            if (index !== -1) {
              for (let i = 0; i < arrTimePassed.length; i++) {
                if (i < index && !timePicked.includes(arrTimePassed[i].value)) {
                  arrTimePassed[i].disabled = true;
                } else {
                  if (arrTimePassed[i + 1]) {
                    const betweenTime = Math.abs(
                      moment(arrTimePassed[index].label, "HH:mm").diff(
                        moment(arrTimePassed[i + 1].label, "HH:mm"),
                        "minutes"
                      )
                    );
                    if (betweenTime < duration) {
                      arrTimePassed[i + 1].disabled = true;
                    }
                  }
                }
              } 
            }
            setListTime(arrTimePassed);
          } 
          else if (!isCheck || isCheck && res.data === 0) {
            const index = arrTime.findIndex((item) => item.value === timePic);
            // console.log("index--", index);
            if (index !== -1) {
              for (let i = 0; i < arrTime.length; i++) {
                if (i < index && !timePicked.includes(arrTime[i].value)) {
                  arrTime[i].disabled = true;
                } else {
                  if (arrTime[i + 1]) {
                    const betweenTime = Math.abs(
                      moment(arrTime[index].label, "HH:mm").diff(
                        moment(arrTime[i + 1].label, "HH:mm"),
                        "minutes"
                      )
                    );
                    if (betweenTime < duration) {
                      arrTime[i + 1].disabled = true;
                    }
                  }
                }
              }
            }
            setListTime(arrTime);
          } else if (isCheck && arrTimePassed.length === 0){
            setListTime([]);
          }
        }
      } catch (error) {
        console.log("Failed to fetch movies list: ", error);
      }
    };

    if (moviePicked && cinemaPicked && hallPicked) {
      getTimes();
    }
  }, [
    moviePicked,
    timePicked,
    cinemaPicked,
    hallPicked,
    isCheck,
    startDatePicked,
    endDatePicked,
  ]);

  useEffect(() => {
    const getHalls = async () => {
      try {
        if (cinemaPicked) {
          console.log("cinemaPicked", cinemaPicked);
          const response = await cinameApi.getHallByCinema(cinemaPicked);
          console.log("hall", response);
          if (response) {
            const newArr = response.map((val) => {
              return { value: val.id, label: val.name };
            });

            setListHall(newArr);
          }
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getHalls();
  }, [cinemaPicked]);

  const content = (
    <div>
      <p>
        {` Bạn có thể chọn những khung giờ chiếu lớn hơn hoặc bằng thời lượng phim: ${durationString}`}
      </p>
    </div>
  );

  return (
    <>
      <Drawer
        title="Tạo mới suất chiếu"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            {timePicked.length > 0 && (
              <Button type="default" onClick={checkShowDuplicate}>
                Xem lịch trùng
              </Button>
            )}
            <Button form="myForm" htmlType="submit" type="primary">
              Thêm
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit} id="myForm" layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="movie"
                label="Chọn phim"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn bộ phim...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn phim"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeMovie}
                  options={listMovie}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cinema"
                label="Chọn chi nhánh"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn chi nhánh...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn chi nhánh"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeCinema}
                  options={listCinema}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hall"
                label="Chọn phòng chiếu"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn phòng chiếu...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn phòng chiếu"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeHall}
                  options={listHall}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="date"
                label="Thời gian chiếu"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời gian chiếu...",
                  },
                ]}
              >
                <RangePicker
                  style={{
                    width: "100%",
                  }}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  onChange={onChangeDate}
                  disabledDate={
                    (current) => {
                      return current && current < moment().endOf('day') || current > moment(endDateMoviePicked).endOf("day");
                    }
                  }
                 // disabledDate={disabledDate}
                  disabled={moviePicked ? false : true}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="showTime"
                label={
                  <>
                    <Space>
                      <p>
                        Chọn suất chiếu
                        {durationString && (
                          <Popover content={content} title="Chọn suất chiếu">
                            <InfoCircleTwoTone />
                          </Popover>
                        )}
                      </p>
                      <Checkbox
                        style={{ marginLeft: "300px" }}
                        onChange={onChangeCheck}
                      >
                        Hiển thị khung giờ không trùng
                      </Checkbox>
                    </Space>
                  </>
                }
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn suất chiếu...",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  tokenSeparators={[","]}
                  placeholder="Chọn suất chiếu"
                  value={timePicked}
                  style={{
                    width: "100%",
                  }}
                  options={listTime}
                  onChange={onChangeTime}
                  status={status}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Modal
        title="Danh sách lịch trùng"
        onCancel={() => {
          setIsModalOpen(false);
          setListShowDuplicate([]);
        }}
        open={isModalOpen}
        width={1000}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsModalOpen(false);
              setListShowDuplicate([]);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Table columns={columns} dataSource={listShowDuplicate} />
      </Modal>
    </>
  );
};
export default ModelAddShow;
