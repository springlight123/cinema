import { useEffect } from "react";
import { useState } from "react";
import { fetchRevenue } from "../../services/StatitisFetch";
import moment from "moment";
import { VND } from "../../constant";
import { featchStaffByIdCinema } from "../../services/StaffFetch";
import { useSelector } from "react-redux";
const dateFormat = "YYYY-MM-DD";

const useRevenueComponentHook = () => {
  const [revenues, setRevenues] = useState([]);
  const user = useSelector((state) => state.user);
  const [staffs, setStaff] = useState([]);
  const [idStaff, setIdStaff] = useState(null)
  const [params, setParams] = useState({
    end_date: moment().format(dateFormat),
    start_date: moment().startOf("month").format(dateFormat),
    cinema_id: user?.cinema_id || 1,
    staff_id: idStaff
  });

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    setParams({
      ...params,
      start_date: dateString[0].replaceAll('/', '-'),
      end_date: dateString[1].replaceAll('/', '-'),
    });
  };

  const handleChangeEmployee = (value) =>{
    if(value === "00000"){
      setIdStaff(null);
      setParams({...params, staff_id: null})
      return;
    }
    setIdStaff(value)
    setParams({...params, staff_id: value})
  }

  useEffect(() => {
    fetchRevenue(params)
      .then((data) => {
        if (data.length === 0) {
          setRevenues([]);
        } else {
          if(idStaff){
            const newDate = data.map((val, idx) => {
              return {
                ...val,
                stt: idx + 1,
                createdAt: val?.createdAt.substring(0, 10),
                discount: val?.discount.toString(),
                totalDiscount: val?.totalDiscount.toString(),
                total: val?.total.toString(),
                idEmployee: val?.Staff?.id,
                name: val?.Staff?.firstName + " " + val?.Staff?.lastName
              };
            });

            setRevenues(newDate);
          }else{
            console.log(data)
            // if staff_id is duplicate => same stt
            
            const newDate = data.map((val, idx) => {
              return {
                ...val,
                stt: val?.Staff?.id === data[idx - 1]?.Staff?.id ? idx : idx + 1,
                createdAt: val?.createdAt.substring(0, 10),
                discount: val?.discount,
                totalDiscount: val?.totalDiscount,
                total: val?.total,
                idEmployee: val?.Staff?.id,
                name: val?.Staff?.firstName + " " + val?.Staff?.lastName
              };
            });

            setRevenues(newDate);

          }
        }
      })
      .catch(() => {
        console.log("fetch revunues failed!!");
      });
  }, [params, idStaff]);

  useEffect(() => {
    featchStaffByIdCinema(user?.cinema_id || 1)
      .then((data) => {
        const newDate = data.map(val =>{
          return {
            value: val?.id,
            label: val?.firstName + " " + val?.lastName + " - " + val?.phone
          }
        })
        newDate.push({
          value: "00000",
          label: 'Tất cả nhân viên'
        })
        setStaff(newDate);
      })
      .catch(() => {
        console.log("fetch revunues failed!!");
      });
  }, []);

  return {
    revenues,
    onChangeDate,
    staffs,
    handleChangeEmployee,
    idStaff,
    start_date: params.start_date,
    end_date: params.end_date,
  };
};

export default useRevenueComponentHook;
