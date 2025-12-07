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
    top: { style: "thin" },
  };
  const colorHeader = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ffddebf7" },
  };
  const borderAll = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  let row_index = 8;
  let idCustomer_curr;
  let index_curr = 1;

  const worksheet = workbook.addWorksheet("DSBN_KH", {
    views: [{ showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: "landscape" },
    properties: { defaultColWidth: 20, defaultRowHeight: 25 },
  });
  worksheet.addRow(["Hệ thống rạp chiếu phim CMS"]);
  worksheet.addRow([
    "04 Nguyễn Văn Bảo, phường 2, quận Gò Vấp, thành phố Hồ Chí Minh",
  ]);
  worksheet.addRow(["Ngày xuất báo cáo: " + new Date().toLocaleDateString()]);
  worksheet.addRow(["DOANH SỐ THEO KHÁCH HÀNG"]);
  worksheet.addRow([
    "Từ ngày: " + start_date + "         " + " Đến ngày " + end_date,
  ]);
  worksheet.addRow([]);
  worksheet.addRow([
    "STT",
    "Mã KH",
    "Tên KH",
    "Địa chỉ",
    "Phường/Xã",
    "Quận/Huyện",
    "Tỉnh/Thành",
    "Nhóm KH",
    "Số vé",
    "Chiết khấu",
    "Doanh số trước CK",
    "Doanh số sau CK",
  ]);
  

  // set border table header
  worksheet.getCell("A7").border = borderAll;
  worksheet.getCell("B7").border = borderAll;
  worksheet.getCell("C7").border = borderAll;
  worksheet.getCell("D7").border = borderAll;
  worksheet.getCell("E7").border = borderAll;
  worksheet.getCell("F7").border = borderAll;
  worksheet.getCell("G7").border = borderAll;
  worksheet.getCell("H7").border = borderAll;
  worksheet.getCell("I7").border = borderAll;
  worksheet.getCell("J7").border = borderAll;
  worksheet.getCell("K7").border = borderAll;
  worksheet.getCell("L7").border = borderAll;

  worksheet.getCell("A7").fill = colorHeader;
  worksheet.getCell("B7").fill = colorHeader;
  worksheet.getCell("C7").fill = colorHeader;
  worksheet.getCell("D7").fill = colorHeader;
  worksheet.getCell("E7").fill = colorHeader;
  worksheet.getCell("F7").fill = colorHeader;
  worksheet.getCell("G7").fill = colorHeader;
  worksheet.getCell("H7").fill = colorHeader;
  worksheet.getCell("I7").fill = colorHeader;
  worksheet.getCell("J7").fill = colorHeader;
  worksheet.getCell("K7").fill = colorHeader;
  worksheet.getCell("L7").fill = colorHeader;

  worksheet.mergeCells("A1:C1");
  worksheet.mergeCells("A2:C2");
  worksheet.mergeCells("A3:C3");

  worksheet.mergeCells("A4:L4");
  worksheet.mergeCells("A5:L5");

  worksheet.columns = [
    { key: "index", width: 5 },
    { key: "id", width: 15 },
    { key: "name", width: 20 },
    { key: "address", width: 20 },
    { key: "ward", width: 20 },
    { key: "district", width: 20 },
    { key: "city", width: 20 },
    { key: "rank", width: 20 },
    { key: "count", width: 5 },
    { key: "discount", width: 15 },
    { key: "revenueBeforeDiscount", width: 20 },
    { key: "revenueAfterDiscount", width: 20 },
  ];

  worksheet.getColumn("index").alignment = alignmentLeft;
  worksheet.getColumn("id").alignment = alignmentCenter;

  worksheet.getColumn("count").numFmt = "#,##0";
  worksheet.getColumn("discount").numFmt = "#,##0";
  worksheet.getColumn("revenueBeforeDiscount").numFmt = "#,##0";
  worksheet.getColumn("revenueAfterDiscount").numFmt = "#,##0";

  worksheet.getColumn("index").font = fontNormal;
  worksheet.getColumn("id").font = fontNormal;
  worksheet.getColumn("name").font = fontNormal;
  worksheet.getColumn("address").font = fontNormal;
  worksheet.getColumn("ward").font = fontNormal;
  worksheet.getColumn("district").font = fontNormal;
  worksheet.getColumn("city").font = fontNormal;
  worksheet.getColumn("rank").font = fontNormal;
  worksheet.getColumn("count").font = fontNormal;
  worksheet.getColumn("discount").font = fontNormal;
  worksheet.getColumn("revenueBeforeDiscount").font = fontNormal;
  worksheet.getColumn("revenueAfterDiscount").font = fontNormal;

  data.forEach((item, index) => {
    if (index === 0) {
      idCustomer_curr = item?.idCustomer;
      worksheet.addRow({
        index: index_curr,
        id: item?.idCustomer,
        name: item?.name,
        address: item?.address,
        ward: item?.ward,
        district: item?.district,
        city: item?.city,
        rank: item?.rank,
        count: item?.tickets,
        discount: item?.discount,
        revenueBeforeDiscount: item?.totalDiscount,
        revenueAfterDiscount: item?.total,
      });

    //   worksheet.getCell(`A${row_index}`).border = borderAll;
      worksheet.getCell(`B${row_index}`).border = borderAll;
      worksheet.getCell(`C${row_index}`).border = borderAll;
      worksheet.getCell(`D${row_index}`).border = borderAll;
      worksheet.getCell(`E${row_index}`).border = borderAll;
      worksheet.getCell(`F${row_index}`).border = borderAll;
      worksheet.getCell(`G${row_index}`).border = borderAll;
      worksheet.getCell(`H${row_index}`).border = borderAll;
      worksheet.getCell(`I${row_index}`).border = borderAll;
      worksheet.getCell(`J${row_index}`).border = borderAll;
      worksheet.getCell(`K${row_index}`).border = borderAll;
      worksheet.getCell(`L${row_index}`).border = borderAll;

      worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;


      row_index++;
    } else {
      if (item.idCustomer === idCustomer_curr) {
        worksheet.addRow({
          index: "",
          id: item?.idCustomer,
          name: item?.name,
          address: item?.address,
          ward: item?.ward,
          district: item?.district,
          city: item?.city,
          rank: item?.rank,
          count: item?.tickets,
          discount: item?.discount,
          revenueBeforeDiscount: item?.totalDiscount,
          revenueAfterDiscount: item?.total,
        });

        // worksheet.getCell(`A${row_index}`).border = borderAll;
        worksheet.getCell(`B${row_index}`).border = borderAll;
        worksheet.getCell(`C${row_index}`).border = borderAll;
        worksheet.getCell(`D${row_index}`).border = borderAll;
        worksheet.getCell(`E${row_index}`).border = borderAll;
        worksheet.getCell(`F${row_index}`).border = borderAll;
        worksheet.getCell(`G${row_index}`).border = borderAll;
        worksheet.getCell(`H${row_index}`).border = borderAll;
        worksheet.getCell(`I${row_index}`).border = borderAll;
        worksheet.getCell(`J${row_index}`).border = borderAll;
        worksheet.getCell(`K${row_index}`).border = borderAll;
        worksheet.getCell(`L${row_index}`).border = borderAll;

        worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;


        row_index++;
      } else {
        index_curr += 1;
        idCustomer_curr = item?.idCustomer;
        worksheet.addRow({
            index: index_curr,
            id: item?.idCustomer,
            name: item?.name,
            address: item?.address,
            ward: item?.ward,
            district: item?.district,
            city: item?.city,
            rank: item?.rank,
            count: item?.tickets,
            discount: item?.discount,
            revenueBeforeDiscount: item?.totalDiscount,
            revenueAfterDiscount: item?.total,
        });

        worksheet.getCell(`B${row_index}`).border = borderAll;
        worksheet.getCell(`C${row_index}`).border = borderAll;
        worksheet.getCell(`D${row_index}`).border = borderAll;
        worksheet.getCell(`E${row_index}`).border = borderAll;
        worksheet.getCell(`F${row_index}`).border = borderAll;
        worksheet.getCell(`G${row_index}`).border = borderAll;
        worksheet.getCell(`H${row_index}`).border = borderAll;
        worksheet.getCell(`I${row_index}`).border = borderAll;
        worksheet.getCell(`J${row_index}`).border = borderAll;
        worksheet.getCell(`K${row_index}`).border = borderAll;
        worksheet.getCell(`L${row_index}`).border = borderAll;

        worksheet.getCell(`A${row_index}`).border = borderRight_BT;
        worksheet.getCell(`A${row_index}`).alignment = alignmentCenter;



        row_index++;
      }
    }
  });

  worksheet.addRow({
    index: "Tổng cộng",
    id: "",
    name: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    rank: "",
    count: data?.reduce((a, b) => a + b?.tickets, 0),
    discount: data?.reduce((a, b) => a + b?.discount, 0),
    revenueBeforeDiscount: data?.reduce((a, b) => a + b?.totalDiscount, 0),
    revenueAfterDiscount: data?.reduce((a, b) => a + b?.total, 0),
  }).font = fontBold;

  worksheet.getCell(`A${row_index}`).border = borderTopBottom;
  worksheet.getCell(`B${row_index}`).border = borderTopBottom;
  worksheet.getCell(`C${row_index}`).border = borderTopBottom;
  worksheet.getCell(`D${row_index}`).border = borderTopBottom;
  worksheet.getCell(`E${row_index}`).border = borderTopBottom;
  worksheet.getCell(`F${row_index}`).border = borderTopBottom;
  worksheet.getCell(`G${row_index}`).border = borderTopBottom;
  worksheet.getCell(`H${row_index}`).border = borderTopBottom;
  worksheet.getCell(`I${row_index}`).border = borderTopBottom;
  worksheet.getCell(`J${row_index}`).border = borderTopBottom;
  worksheet.getCell(`K${row_index}`).border = borderTopBottom;
  worksheet.getCell(`L${row_index}`).border = borderTopBottom;

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
