import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Col,
  Row,
  Typography,
  Tooltip,
  Space,
} from "antd";
import "./LoginForm.scss";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import userApi from "../../api/userApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import tokenService from "../../service/token.service";
import { notifyError } from "../../utils/Notifi";
import { ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
const { Title, Text } = Typography;
const LoginForm = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState("")
  const dispatch = useDispatch();

  const setOnChangeUserName = (e) => {
    setUserName(e.target.value);
    setError("")
  };
  const setOnChangePass = (e) => {
    setPassword(e.target.value);
    setError("")
  };

  const handleSubmitForm = () => {
    setLoadingStatus(true);
    //call api for login
    const loginUser = async (username, pass) => {
      try {
        const response = await userApi.login(username, pass);

        setLoadingStatus(false);
        //console.log(response);
        //set user info
        if (response) {
          //redirct home page
          navigate("/");
          dispatch(setUser(response.data.staff));

          //luu thông tin acessTonken vào localstorage
          tokenService.setUser(response.data);
        }
      } catch (error) {
        console.log("Failed to login ", error);
        if(error?.response?.data?.message === "Password is not valid" || error?.response?.data?.message === "Tài khoản hoặc mật khẩu sai.") {
          setError("Tên tài khoản hoặc mật khẩu không chính xác.")

        }  else {
          setError(error?.response?.data?.message)
        }
        setLoadingStatus(false)
      }
    };
    loginUser(userName, password);
  };

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (
    <Row style={{ height: "100vh" }} className="login">
      <Col span={8}></Col>
      <Col span={8} style={{ height: "100%", padding: "0 12px" }}>
        <div className="login_form">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white", fontSize: "2.2rem", margin: 0 }}>
              CineStar Hub
            </h1>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                color: "#9f9f9f",
               
              }}
            >
            SPECIAL ACCESS REQUIRED
            </p>
          </div>
          <form
            onSubmit={() => handleSubmitForm()}
            style={{
              //backgroundColor: "white",
              borderRadius: "",
              padding: "2rem 2rem",
            }}
          >
            {
              error ? 
              <span style={{color:"red", fontSize:"14px", lineHeight:"23px", textTransform:"capitalize"}}>{error}</span>
              : null
            }
            <Input
              size="large"
              placeholder="Nhập tên tài khoản"
              onChange={(e) => setOnChangeUserName(e)}
              prefix={<UserOutlined />}
              style={{fontSize:"14px", padding:"10px", marginTop:"10px"}}
            />
           
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              onChange={(e) => setOnChangePass(e)}
              prefix={<LockOutlined />}
              style={{ marginTop: "1.5rem", marginBottom: "1.5rem", fontSize:"14px", padding:"10px" }}
            />
             {/* <ReCAPTCHA
              sitekey="6LcsidglAAAAAFYnGRLQDCGqx8ZgKEf_b1GPOsjM"
              onChange={onChange}
              size="normal"
              data-theme="dark"
            /> */}
            {userName && password ? (
              <Button
                onClick={() => handleSubmitForm()}
                type="primary"
                style={{ width: "100%",color:"white", marginTop:"1rem", borderColor:"#058dd9",backgroundColor:"#058dd9", height: "40px", marginBottom: "1rem" }}
                loading={loadingStatus}
              >
                Đăng Nhập
              </Button>
            ) : (
              <Button
                onClick={() => handleSubmitForm()}
                disabled
                type="primary"
                style={{ width: "100%", color:"white", marginTop:"1rem", borderColor:"#058dd9", backgroundColor:"#058dd9", height: "40px", marginBottom: "1rem" }}
              >
                Đăng Nhập
              </Button>
            )}
            <p className="forgetPassword" onClick={() => navigate("/forgot-password")}>
              Quên mật khẩu?
            </p>
          </form>
        </div>
      </Col>
      <Col span={8}></Col>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
    </Row>
  );
};
export default LoginForm;
