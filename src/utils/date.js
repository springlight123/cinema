import moment from "moment";

export const checkStartDate = () => ({
  validator(rule, value) {
    if (!value) {
      return Promise.reject("Hãy nhập ngày bắt đầu!");
    }
    if (value < new Date()) {
      return Promise.reject("Ngày bắt đầu nhỏ hơn ngày kết thúc!");
    }
    if (value > moment(endDate)) {
        return Promise.reject(
          "Ngày bắt đầu phải nhỏ hơn ngày kết thúc."
        );
      }
    return Promise.resolve();
  },
});

export const checkEndDate = ({ startDate }) => ({
  validator(rule, value) {
    if (!value) {
      return Promise.reject("Hãy nhập ngày kết thúc.");
    }
    if (value < moment(startDate)) {
      return Promise.reject("Ngày kết thúc phải lớn hơn hoặc ngày bắt đầu.");
    }
    return Promise.resolve();
  },
});
