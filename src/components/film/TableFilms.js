import React, { useEffect, useState } from "react";
import { Button, Table, Modal,Image,message,Badge,Tag, } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import movieApi from "../../api/movieApi";
import ModelDetailMovie from "./ModelMovieDetail";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import { useRoleHook } from "../../utils/useRoleHook.js";




const TableFilms = ({keyword,startDatePicker,endDatePicker}) => {
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listMovie, setListMovie] = useState([]);
  const [showModalDetailMovie, setShowModalDetailMovie] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const {isMangement} = useRoleHook()

  const showModalDetail = (e) => {
    setShowModalDetailMovie(true);
    setSelectedId(e);
  };

  const columns = [
    
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Mã phim",
      dataIndex: "code",
      render: (val,record) => {
        return <a onClick={()=>{
          showModalDetail(record.id);
        }}>{val}</a>;
      }
    },
    {
      title: "Tên phim",
      dataIndex: "nameMovie",
      render: (text) => {
        if (text?.length > 30) {
          return <span style={{textTransform:"capitalize"}}>{text?.substring(0, 30).toLowerCase() + "..."}</span>
        } else {
          return <span style={{textTransform:"capitalize"}}>{text.toLowerCase()}</span>
        }
      },
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
    },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      sorter: (a, b) => {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        let text = "Hoạt động";
        if (status === 1) {
          color = "success";
          text = "Hoạt động";
        }
        if (status === 0) {
          color = "error";
          text = "Ngừng hoạt động";
        }
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
      // filters: [
      //   {
      //     text: "Hoạt động",
      //     value: "Hoạt động",
      //   },
      //   {
      //     text: "Ngừng hoạt động",
      //     value: "Ngừng hoạt động",
      //   },
      // ],
      // onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      render: (val,record) => {
        if(!isMangement) return null
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



  //handle delete Movie in here...
  const handleDelete = () => {
    showModal();
  };

  //handle update Movie in here ....
  const handleUpdate = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      // setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  ///
  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const deleteMovie = async () => {
      try {
        const response = await movieApi.deleteMovie(selectedId);
        console.log(response);
        if (response) {
          //handle data
          depatch(setReload(!reload));
          message.success("Xóa thành công");
        }
      } catch (error) {
        console.log("Failed to fetch: ", error);
        message.error("Xóa thất bại");
      }
    };
    deleteMovie();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  /////


  useEffect(() => {
    //load movies
    const gettListMovie = async () => {
      try {
        const response = await movieApi.getMovies({
          keyword: keyword,
          startDate: startDatePicker,
          endDate: endDatePicker ,
        });
        //set user info
        if (response) {
          //handle data
          const newList = response.map((movie) => {
            movie.releaseDate = movie?.releaseDate?.substring(0, 10);
            movie.duration = movie?.duration + " " + "phút";
            movie.endDate = movie?.endDate?.substring(0, 10);
            movie.status = movie?.status;
            movie.code = movie?.codeMovie;

            return movie;
          });
          setListMovie(response);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    gettListMovie();
  }, [reload,keyword,startDatePicker,endDatePicker]);

  return (
    <div>
      <Table columns={columns} dataSource={listMovie}
       
      />
      <Modal
        title="Xóa phim"
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
        <p>Bạn muốn phim này không?</p>
      </Modal>

      {showModalDetailMovie ? (
        <ModelDetailMovie
          showModalDetailMovie={showModalDetailMovie}
          setShowModalDetailMovie={setShowModalDetailMovie}
          selectedId={selectedId}
        />
      ) : null}

    </div>
  );
};
export default TableFilms;
