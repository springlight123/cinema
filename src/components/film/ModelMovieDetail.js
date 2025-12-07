import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import categoryMovie from "../../api/categoryMovie";
import { fimlValidator } from "./FilmSchema";
import cinameApi from "../../api/cinemaApi";
import movieApi from "../../api/movieApi";
import moment from "moment";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import { notifyError,
  notifySucess
 } from "../../utils/Notifi";


const ModelDetailMovie = ({ showModalDetailMovie, setShowModalDetailMovie,selectedId }) => {
  const [listCategory, setListCategory] = useState([]);
  const [listCinema, setListCinema] = useState([]);
  const [nameMovie, setNameMovie] = useState("");
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [linkTrailer, setLinkTrailer] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState(0);
  const [releaseDate, setReleaseDate] = useState("");
  const [desc, setDesc] = useState("");
  const [classify, setClassify] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [movieInfo, setMovieInfo] = useState({});
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");
  const [imagePicker, setImagePicker] = useState([]);

  const [form] = Form.useForm();

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const { RangePicker } = DatePicker;

  const formatDate = "YYYY-MM-DD";

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalDetailMovie(false);
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChangeTime = (value) => {
    setTime(value);
  };
  const handleChangeCategory = (value) => {
    setCategory(value);
  };

  const onChangeEndDate = (date, dateString) => {
    setEndDate(dateString);
  };

  const onChangeClassify = (value) => {
    setClassify(value);
  };

  const onChangeStatus = (value) => {
    setStatus(value);
  };

  useEffect(() => {
    const fetchMovieInfo = async () => {
      const response = await movieApi.getMovieById(selectedId);
      console.log(response);
      setStartDatePicker(moment(response.releaseDate).format(formatDate));
      setEndDatePicker(moment(response.endDate).format(formatDate));
      setMovieInfo(response);
      setNameMovie(response.nameMovie);
      setCast(response.cast);
      setDirector(response.director);
      setLinkTrailer(response.linkTrailer);
      setCategory(response.idCategoryMovie);
      setTime(response.duration);
      setReleaseDate(response.releaseDate);
      setDesc(response.desc);
      setClassify(response.classify);
      setEndDate(response.endDate);
      setStatus(response.isActived);
      setImage(response.image);
     
      let trailerTpm = " "
      if(response.linkTrailer !== "undefined"){
        trailerTpm = response.linkTrailer
      }

      form.setFieldsValue({
        id: response.id,
        nameMovie: response.nameMovie,
        cast: response.cast,
        director: response.director,
        linkTrailer: trailerTpm,
        category: response.idCategoryMovie,
        time: response.duration,
        releaseDate: moment(response.releaseDate),
        desc: response?.desc,
        classify: response.classify,
        endDate: moment(response.endDate),
        status: response.status,
        cinema:response.idCinema,
        codeMovie:response.codeMovie,
        // date: [moment(response.releaseDate), moment(response.endDate)],
        date: [dayjs(response.releaseDate,formatDate), dayjs(response.endDate,formatDate)],
        image: [{
          uid: "-1",
          name: response?.image,
          status: "done",
          url: response?.image,
        }]
      });
    };
    fetchMovieInfo();
  }, []);


  const handleSubmit = async(val) => {
    console.log(val);
    console.log("imagePicker",imagePicker);
    const {
      category, classify, codeMovie, 
      cast, desc, director, 
      image, linkTrailer, nameMovie, time, status,
    } = val;
    
    const data = new FormData();
    data.append("nameMovie", nameMovie);
    data.append("codeMovie", codeMovie);
    data.append("cast", cast);
    data.append("director", director);
    data.append("linkTrailer", linkTrailer);
    data.append("idCategoryMovie", category);
    data.append("duration", time);
    data.append("releaseDate", new Date(startDatePicker));
    data.append("desc", desc);
    data.append("classify", classify);
    data.append("endDate", new Date(endDatePicker));
    data.append("status", status);
    
    if (imagePicker) {
      if (imagePicker.length === 0){
        console.log("image no");
      } else {
        data.append("image", image[0].originFileObj);
      }
    } else {
      data.append("image", image);
    }
    try {
      const response = await movieApi.updateMovie(selectedId,data);
      console.log(response);
      if(response){
        setShowModalDetailMovie(false);
        notifySucess("Cập nhật phim thành công");
        depatch(setReload(!reload));
      }
    } catch (error) {
      console.log("Failed to login ", error);
      notifyError("Cập nhật phim thất bại!, Lỗi: " + error);
    }
  };
  useEffect(() => {
    //load categories
    const getCategories = async () => {
      try {
        const response = await categoryMovie.getCategory();

        console.log(response);
        //set user info
        if (response) {
          //handle data
          const newArr = response.map((val) => {
            return { value: val.id, label: val.nameCategory };
          });
          setListCategory(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    //load categories
    const getCinemas = async () => {
      try {
        const response = await cinameApi.getCinemas();

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
    getCategories();
  }, []);


  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setImage(file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);

  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };


  return (
    <>
      <Drawer
        title="Thêm bộ phim"
        width={720}
        onClose={onClose}
        open={showModalDetailMovie}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button form="myForm" htmlType="submit" type="primary">
              Cập nhật
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit} id="myForm" layout="vertical">
          <Row gutter={16}>
            
            <Col span={12}>
              <Form.Item name="codeMovie" label="Mã phim" >
                <Input disabled={true}  />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nameMovie"
                label="Tên bộ phim"
                
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên bộ phim...",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setNameMovie(e.target.value)}
                  placeholder="Hãy nhập tên bộ phim..."
                  
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Thể loại"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thể loại bộ phim...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn thể loại"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeCategory}
                  options={listCategory}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Thời lượng"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời lượng bộ phim...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn thời lượng"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeTime}
                  options={[
                    {
                      value: "60",
                      label: "60 phút",
                    },
                    {
                      value: "90",
                      label: "90 phút",
                    },
                    {
                      value: "120",
                      label: "120 phút",
                    },
                    {
                      value: "180",
                      label: "180 phút",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="classify"
                label="Độ tuổi thích hợp"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn độ tuổi thích hợp...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn độ tuổi thích hợp"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeClassify}
                  options={[
                    {
                      value: "C13"  ,
                      label: "C13 - 13 tuổi trở lên",
                    },
                    {
                      value: "C16",
                      label: "C16 - 16 tuổi trở lên",
                    },
                    {
                      value: "C18",
                      label: "C18 - 18 tuổi trở lên",
                    },
                    {
                      value: "C21",
                      label: "C21 - 21 tuổi trở lên",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="date"
                label="Thời hạn phim"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời hạn phim...",
                  },
                ]}
              >
                <RangePicker 
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  onChange={onChangeDate}
                  disabledDate={
                    (current) => {
                      return current && current < moment().endOf('day');
                    }
                  }
                />
                  
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="linkTrailer"
                label="Link trailer"
              >
                <Input
                  onChange={(e) => setLinkTrailer(e.target.value)}
                  placeholder="Hãy nhập link trailer..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="director"
                label="Đạo diễn"
                rules={[
                  {
                    required: true,
                    message: "Hãy tên đạo diễn...",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="Hãy nhập tên đạo diễn..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cast"
                label="Diễn viên"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên diễn viên...",
                  },
                ]}
              >
                <Input
                  onChange={(e) => setCast(e.target.value)}
                  placeholder="Hãy nhập tên diễn viên..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row  gutter={16}>
            
            
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn trạng thái...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeStatus}
                  options={[
                    {
                      value:  1,
                      label: "Hoạt động",
                    },
                    {
                      value: 0,
                      label: "Ngừng hoạt động",
                    }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
              name="image"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Chỉ chấp nhận file ảnh"
              type="file"
            >
              <Upload name="logo" customRequest={dummyRequest}
                 listType="picture" 
                 maxCount={1} 
                 accept=".jpg,.jpeg,.png"
                 onChange={(e) => {
                  setImagePicker(e.fileList[0]);
                }}
              >
                <Button  icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="desc" label="Mô tả">
                <Input.TextArea
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  placeholder="Nhập mô tả..."
                />
              </Form.Item>
            </Col>
          </Row>

          
        </Form>
      </Drawer>
    </>
  );
};
export default ModelDetailMovie;
