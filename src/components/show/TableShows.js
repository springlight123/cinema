import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Select, Badge, Tag, DatePicker,message } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import showApi from "../../api/showApi";
import showTimeApi from "../../api/showTimeApi";
import moment from "moment/moment";
import TableShowTime from "./TableShowTime";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import cinameApi from "../../api/cinemaApi";
import movieApi from "../../api/movieApi";
import { useRoleHook } from "../../utils/useRoleHook.js";
const { Option } = Select;
const TableShows = ({ setShowModalAddCustomer, setTab }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listShow, setListShow] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [listShowTime, setListShowTime] = useState([]);
  const { RangePicker } = DatePicker;
  const [cinemaPicker, setCinemaPicker] = useState([]);
  const [moviePicker, setMoviePicker] = useState([]);
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");
  const [listCinema, setListCinema] = useState([]);
  const [listMovie, setListMovie] = useState([]);

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const {isEmployee} = useRoleHook()
  const [listTimeDuplicate, setListTimeDuplicate] = useState([]);
  const [isModalOpenShow, setIsModalOpenShow] = useState(false);

  const columns_show = [
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


  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    // },
    {
      title: "Mã lịch chiếu",
      dataIndex: "code",
    },
    {
      title: "Bộ phim",
      dataIndex: "filmShow",
      render: (text) => {
        if (text?.length > 30) {
          return <span style={{textTransform:"capitalize"}}>{text?.substring(0, 30).toLowerCase() + "..."}</span>
        } else {
          return <span style={{textTransform:"capitalize"}}>{text.toLowerCase()}</span>
        }
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
    },
    {
      title: "Phòng chiếu",
      dataIndex: "roomShow",
    },
    {
      title: "Chi nhánh",
      dataIndex: "locationShow",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (val,record) => {
        let color = "";
        let text = "";
        if (val === 1) {
          text = "Hoạt động";
          color = "green";
        } else if (val === 0) {
          text = "Ngừng hoạt động";
          color = "red";
        }
        return (
          <>
            <Badge
              color={color}
            />
            <Select
              value={val}
              style={{
                width: 170,
              }}
              bordered={false}
              // value={val}

              onChange={(value) => {
                handleChangeStatus(value, record);
                }
              }
            >
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Ngừng hoạt động</Option>
            </Select>
          </>
        );
      },
    },
    {
      render: (val,record) => {
        return (
          <Button
            disabled={record.status === 1 ? true : false}
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedId(record.id);
              handleDelete();
            }}
            danger
          >
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchShowTimeByShowId = async () => {
      const response = await showTimeApi.getShowTimeByShowId(selectedId);
      let data = [];
      if (response) {
        for (const index in response) {
          data.push({
            showDate: index,
            showTime: response[index].map((item, index) => {
              return item.showTime;
            }),
            status: response[index].map((item, index) => {
              return item.status;
            }),
          });
        }
      }
      setListShowTime(data);
    };

    if (selectedId !== 0) {
      fetchShowTimeByShowId();
    }
  }, [selectedId]);

  const onSelectChange = (selectedId) => {
    setSelectedRowKeys(selectedId);
  };

  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };

  const onChangeCinema = (value) => {
    if (value === undefined) {
      setCinemaPicker([]);
    } else {
      setCinemaPicker(value);
    }
  };

  const onChangeMovie = (value) => {
    if (value === undefined) {
      setMoviePicker([]);
    } else {
      setMoviePicker(value);
    }
  };

  const handleChangeStatus = async (value, record) => {
    console.log(value);
    const check = async () => {
      const timeUnique = await showTimeApi.getlistTimeUnique(record.id);
      const payload = {
        startDate: record.startDate,
        endDate: record.endDate,
        showTime: timeUnique,
        idCinemaHall: record.idHall,
        idMovie: record.idMovie,
        idCinema: record.idCinema,
      }
      try {
        const response = await showApi.checkShowIsExist(payload);
        if (response.length === 0) {
          const response = await showApi.updateShow(record.id, { status: value});
          if (response) {
            message.success("Cập nhật thành công");
            depatch(setReload(!reload));
          }
        }
      } catch (error) {
        const { data } = error.response;
        if (data) {
          console.log(data);
          setIsModalOpenShow(true);
          const list = data.data.map((item) => {
            return {
              idShow: item.idShow,
              codeMovie: item.Show.Movie.codeMovie,
              nameMovie: item.Show.Movie.nameMovie,
              showDate: item.showDate,
              startTime: item.ShowTime.showTime,
              endTime: item.endTime,
              code: item.code,
            };
          });
          setListTimeDuplicate(list);
        }
      }
    }
    if (value === 1) {
      check();
    } else {
      const response = await showApi.updateShow(record.id, { status: value});
      if (response) {
        message.success("Cập nhật thành công");
        depatch(setReload(!reload));
      }
    }

  };

  ///
  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const deleteShow = async () => {
      try {
        const response = await showApi.deleteShow(selectedId);
        if (response) {
          message.success("Xóa thành công");
          depatch(setReload(!reload));
          setSelectedId(0);
        }
      } catch (error) {
        console.log(error);
        message.error("Xóa thất bại");
      }
    };
    deleteShow();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  /////

  const handleOpenAddShow = () => {
    setShowModalAddCustomer(true);
  };

  //show chart
  const handleShowChart = () => {
    setTab(1);
  };

  useEffect(() => {
    //load movies
    const getListShow = async () => {
      console.log("cinema", cinemaPicker);
      console.log("movie", moviePicker);
      try {
        const response = await showApi.getShow(
          {
            cinemaId: cinemaPicker,
            movieId: moviePicker,
            startDate: startDatePicker,
            endDate: endDatePicker,
          }
        );
        console.log(response);
        //set user info
        if (response) {
          const data = response.map((item, index) => {
            return {
              key: index,
              id: item.id,
              idMovie: item.Movie.id,
              idCinema: item.Cinema.id,
              idHall: item.CinemaHall.id,
              filmShow: item.Movie.nameMovie,
              startDate: item.startDate,
              endDate: item.endDate,
              locationShow: item.Cinema.name,
              roomShow: item.CinemaHall.name,
              status: item.status,
              code: item.code,
            };
          });

          setListShow(data);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getListShow();
  }, [reload, cinemaPicker, moviePicker, startDatePicker, endDatePicker]);

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
        console.log(data);
        setListMovie(data);
      }
    };
    fetchMovie();
    fetchCinema();
  }, []);

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Select
            placeholder="Lọc theo chi nhánh"
            style={{
              width: "200px",
            }}
            options={listCinema}
            allowClear
            onChange={onChangeCinema}
          />
          <Select
            placeholder="Lọc theo phim"
            style={{
              width: "300px",
              margin: "0 1rem",
            }}
            allowClear
            options={listMovie}
            onChange={onChangeMovie}
          />
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onCalendarChange={onChangeDate}
          />
        </div>
        <div>
          {
            isEmployee ? null : 
          <Button
            onClick={handleOpenAddShow}
            type="primary"
            icon={<UserAddOutlined />}
            title="Thêm mới suất chiếu"
            style={{
              margin: "0 1rem",
            }}
          >
            Thêm
          </Button>
          }
          <Button
            type="primary"
            icon={<ScheduleOutlined />}
            onClick={() => handleShowChart()}
          >
            Xem lịch chiếu
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => <TableShowTime record={record} />,
          defaultExpandedRowKeys: [listShow.map((item) => item.id)],
          // expandRowByClick: true,
          onExpand: (expanded, record) => {
            setSelectedId(record.id);
          },
        }}
        dataSource={listShow}
      />
      <Modal
        title="Xóa lịch chiếu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" danger type="primary" onClick={handleOk}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn muốn xóa lịch chiếu này không?</p>
      </Modal>
      <Modal
        title="Danh sách lịch trùng"
        onCancel={() => {
          setIsModalOpenShow(false);
          setListTimeDuplicate([]);
        }}
        open={isModalOpenShow}
        width={1000}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsModalOpenShow(false);
              setListTimeDuplicate([]);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Table columns={columns_show} dataSource={listTimeDuplicate} />
      </Modal>
    </div>
  );
};
export default TableShows;
