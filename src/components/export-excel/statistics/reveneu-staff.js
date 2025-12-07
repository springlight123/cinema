import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

export function exportExcel(data, start_date, end_date) {
  const workbook = new ExcelJS.Workbook();
  const fontNormal = { name: "Times New Roman", size: 11 };
  const fontBold = { name: "Times New Roman", size: 11, bold: true };
  const fontTitle = { name: "Times New Roman", size: 14, bold: true };
  const alignmentCenter = { vertical: "middle", horizontal: "center" };
  const alignmentLeft = { vertical: "middle", horizontal: "left" };
  const alignmentRight = { vertical: "middle", horizontal: "right" };
  const borderTopBottom = { top: { style: "thin" }, bottom: { style: "thin" } };
  const borderTable = {
    bottom: { style: "dotted", color: { argb: "#000000" } },
  };
  const borderBottom = { bottom: { style: "thick" } };
  const borderBT = { bottom: { style: "thin" } };
  const borderRight = { right: { style: "thin" } };
  const borderRight_BT = {
    right: { style: "thin" },
    bottom: { style: "thin" },
  };
  const colorHeader = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ffddebf7" },
  };

  let row_index = 8;
  let idStaff_curr;
  let total_revenue = 0;
  let total_revenue_before_discount = 0;
  let discount = 0;
  let index_curr = 1;

  const worksheet = workbook.addWorksheet("DSBN_NV", {
    views: [{ showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: "landscape" },
    properties: { defaultColWidth: 20, defaultRowHeight: 15.5 },
  });
  worksheet.addRow(["Hệ thống rạp chiếu phim CMS"]);
  worksheet.addRow([
    "04 Nguyễn Văn Bảo, phường 2, quận Gò Vấp, thành phố Hồ Chí Minh",
  ]);
  worksheet.addRow(["Ngày xuất báo cáo: " + new Date().toLocaleDateString()]);
  worksheet.addRow(["DOANH SỐ BÁN VÉ THEO NGÀY"]);
  worksheet.addRow([
    "Từ ngày: " + start_date + "         " + " Đến ngày " + end_date,
  ]);
  worksheet.addRow([]);
  worksheet.addRow([
    "STT",
    "Tên NVBH",
    "Ngày",
    "Chiết khấu",
    "Doanh số trước CK",
    "Doanh số sau CK",
  ]);
  // set font header
  worksheet.getRow(1).font = fontNormal;
  worksheet.getRow(2).font = fontNormal;
  worksheet.getRow(3).font = fontNormal;
  worksheet.getRow(4).font = fontTitle;
  worksheet.getRow(4).alignment = alignmentCenter;
  worksheet.getRow(4).height = 35;
  worksheet.getRow(5).font = fontNormal;
  worksheet.getRow(5).alignment = alignmentCenter;
  worksheet.getRow(7).font = fontBold;
  worksheet.getRow(7).alignment = alignmentCenter;

  // set border table header
  worksheet.getCell("A7").border = borderTopBottom;
  worksheet.getCell("B7").border = borderTopBottom;
  worksheet.getCell("C7").border = borderTopBottom;
  worksheet.getCell("D7").border = borderTopBottom;
  worksheet.getCell("E7").border = borderTopBottom;
  worksheet.getCell("F7").border = borderTopBottom;

  worksheet.getCell("A7").fill = colorHeader;
  worksheet.getCell("B7").fill = colorHeader;
  worksheet.getCell("C7").fill = colorHeader;
  worksheet.getCell("D7").fill = colorHeader;
  worksheet.getCell("E7").fill = colorHeader;
  worksheet.getCell("F7").fill = colorHeader;

  worksheet.mergeCells("A4:F4");
  worksheet.mergeCells("A5:F5");

  worksheet.columns = [
    { key: "index", width: 5 },
    { key: "name", width: 25 },
    { key: "date", width: 25 },
    { key: "discount", width: 25 },
    { key: "revenueBeforeDiscount", width: 25 },
    { key: "revenueAfterDiscount", width: 25 },
  ];
  data.forEach((item, index) => {
    if (index === 0) {
      idStaff_curr = item.Staff?.id;
      worksheet.addRow({
        index: index_curr,
        name: item.Staff?.firstName + " " + item.Staff?.lastName,
        date: moment(item.createdAt).format("DD/MM/YYYY"),
        discount: item.discount,
        revenueBeforeDiscount: item.totalDiscount,
        revenueAfterDiscount: item.total,
      });

      worksheet.getCell(`B${row_index}`).border = borderTable;
      worksheet.getCell(`C${row_index}`).border = borderTable;
      worksheet.getCell(`D${row_index}`).border = borderTable;
      worksheet.getCell(`E${row_index}`).border = borderTable;
      worksheet.getCell(`F${row_index}`).border = borderTable;

      worksheet.getCell(`B${row_index}`).font = fontNormal;
      worksheet.getCell(`C${row_index}`).font = fontNormal;
      worksheet.getCell(`D${row_index}`).font = fontNormal;
      worksheet.getCell(`E${row_index}`).font = fontNormal;
      worksheet.getCell(`F${row_index}`).font = fontNormal;

      worksheet.getCell(`D${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`E${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`F${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;
      worksheet.getCell(`A${row_index}`).border = borderRight;

      total_revenue += item.total;
      total_revenue_before_discount += item.totalDiscount;
      discount += item.discount;
      row_index++;
    } else {
      if (item.Staff?.id === idStaff_curr) {
        worksheet.addRow({
          index: "",
          name: item.Staff?.firstName + " " + item.Staff?.lastName,
          date: moment(item.createdAt).format("DD/MM/YYYY"),
          discount: item.discount,
          revenueBeforeDiscount: item.totalDiscount,
          revenueAfterDiscount: item.total,
        });

        worksheet.getCell(`B${row_index}`).border = borderTable;
        worksheet.getCell(`C${row_index}`).border = borderTable;
        worksheet.getCell(`D${row_index}`).border = borderTable;
        worksheet.getCell(`E${row_index}`).border = borderTable;
        worksheet.getCell(`F${row_index}`).border = borderTable;

        worksheet.getCell(`B${row_index}`).font = fontNormal;
        worksheet.getCell(`C${row_index}`).font = fontNormal;
        worksheet.getCell(`D${row_index}`).font = fontNormal;
        worksheet.getCell(`E${row_index}`).font = fontNormal;
        worksheet.getCell(`F${row_index}`).font = fontNormal;

        worksheet.getCell(`D${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`E${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`F${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;
        worksheet.getCell(`A${row_index}`).border = borderRight;

        total_revenue += item.total;
        total_revenue_before_discount += item.totalDiscount;
        discount += item.discount;
        row_index++;
      } else {
        worksheet.addRow({
          index: "",
          name: "",
          date: "Tổng cộng",
          discount: discount,
          revenueBeforeDiscount: total_revenue_before_discount,
          revenueAfterDiscount: total_revenue,
        });

        worksheet.getCell(`B${row_index}`).border = borderBT;
        worksheet.getCell(`C${row_index}`).border = borderBT;
        worksheet.getCell(`D${row_index}`).border = borderBT;
        worksheet.getCell(`E${row_index}`).border = borderBT;
        worksheet.getCell(`F${row_index}`).border = borderBT;
        // worksheet.getCell(`A${row_index}`).border = borderBT;

        worksheet.getCell(`B${row_index}`).font = fontNormal;
        worksheet.getCell(`C${row_index}`).font = fontBold;
        worksheet.getCell(`D${row_index}`).font = fontBold;
        worksheet.getCell(`E${row_index}`).font = fontBold;
        worksheet.getCell(`F${row_index}`).font = fontBold;

        worksheet.getCell(`D${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`E${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`F${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;
        worksheet.getCell(`A${row_index}`).border = borderRight_BT;

        index_curr += 1;
        row_index++;
        idStaff_curr = item.Staff?.id;

        worksheet.addRow({
          index: index_curr,
          name: item.Staff?.firstName + " " + item.Staff?.lastName,
          date: moment(item.createdAt).format("DD/MM/YYYY"),
          discount: item.discount,
          revenueBeforeDiscount: item.totalDiscount,
          revenueAfterDiscount: item.total,
        });

        worksheet.getCell(`B${row_index}`).border = borderTable;
        worksheet.getCell(`C${row_index}`).border = borderTable;
        worksheet.getCell(`D${row_index}`).border = borderTable;
        worksheet.getCell(`E${row_index}`).border = borderTable;
        worksheet.getCell(`F${row_index}`).border = borderTable;

        worksheet.getCell(`B${row_index}`).font = fontNormal;
        worksheet.getCell(`C${row_index}`).font = fontNormal;
        worksheet.getCell(`D${row_index}`).font = fontNormal;
        worksheet.getCell(`E${row_index}`).font = fontNormal;
        worksheet.getCell(`F${row_index}`).font = fontNormal;

        worksheet.getCell(`D${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`E${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`F${row_index}`).numFmt = "#,##0";
        worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;
        worksheet.getCell(`A${row_index}`).border = borderRight;

        total_revenue = item.total;
        total_revenue_before_discount = item.totalDiscount;
        discount = item.discount;
        row_index++;
      }
    }
    if (index === data.length - 1) {
      worksheet.addRow({
        index: "",
        name: "",
        date: "Tổng cộng",
        discount: discount,
        revenueBeforeDiscount: total_revenue_before_discount,
        revenueAfterDiscount: total_revenue,
      });

      worksheet.getCell(`B${row_index}`).border = borderBT;
      worksheet.getCell(`C${row_index}`).border = borderBT;
      worksheet.getCell(`D${row_index}`).border = borderBT;
      worksheet.getCell(`E${row_index}`).border = borderBT;
      worksheet.getCell(`F${row_index}`).border = borderBT;
      // worksheet.getCell(`A${row_index}`).border = borderBT;

      worksheet.getCell(`B${row_index}`).font = fontNormal;
      worksheet.getCell(`C${row_index}`).font = fontBold;
      worksheet.getCell(`D${row_index}`).font = fontBold;
      worksheet.getCell(`E${row_index}`).font = fontBold;
      worksheet.getCell(`F${row_index}`).font = fontBold;

      worksheet.getCell(`D${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`E${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`F${row_index}`).numFmt = "#,##0";
      worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;
      worksheet.getCell(`A${row_index}`).border = borderRight_BT;

      row_index++;
    }
  });

  worksheet.addRow({
    index: "Tổng",
    name: "",
    date: "",
    discount: data.reduce((sum, item) => sum + item.discount, 0),
    revenueBeforeDiscount: data.reduce(
      (sum, item) => sum + item.totalDiscount,
      0
    ),
    revenueAfterDiscount: data.reduce((sum, item) => sum + item.total, 0),
  });
  const totalRow = data.length + 8 + index_curr;
  console.log(totalRow);
  worksheet.getRow(totalRow).font = fontBold;
  worksheet.getRow(totalRow).numFmt = "#,##0";
  worksheet.getCell(`A${totalRow}`).border = borderBottom;
  worksheet.getCell(`B${totalRow}`).border = borderBottom;
  worksheet.getCell(`C${totalRow}`).border = borderBottom;
  worksheet.getCell(`D${totalRow}`).border = borderBottom;
  worksheet.getCell(`E${totalRow}`).border = borderBottom;
  worksheet.getCell(`F${totalRow}`).border = borderBottom;

  const fileName = `DSBH_NV_${new Date().toLocaleDateString()}.xlsx`;
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const xls64 = workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: fileType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
}
