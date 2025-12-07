import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import statitisApi from '../../../api/statitisApi';
import { fetchRevenueByShow } from "../../../services/StatitisFetch";


export function exportExcel (data, startDate, endDate, user) {
    const workbook = new ExcelJS.Workbook();
    const fontNormal = { name: 'Times New Roman', size: 11 };
    const fontBold = { name: 'Times New Roman', size: 11, bold: true };
    const fontTitle = { name: 'Times New Roman', size: 14, bold: true };
    const alignmentCenter = { vertical: 'middle', horizontal: 'center' };
    const alignmentLeft = { vertical: 'middle', horizontal: 'left' };
    const alignmentRight = { vertical: 'middle', horizontal: 'right' };
    const borderAll = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    const borderTopBottom = { top: { style: 'thin' }, bottom: { style: 'thin' } };
    const borderTable = { bottom: { style: 'dotted', color: { argb: '#000000' } } }
    const borderBottom = { bottom: { style: 'thick' } };
    const borderBT = { bottom: { style: 'thin' }  }
    const borderRight = { right: { style: 'thin' } };
    const colorItem = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffe2efda' }};
    const borderTop = { top: { style: 'thin' } };
    const borderTopBottom_thick = { top: { style: 'thin' }, bottom: { style: 'thick' } };
    const colorHeader = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffddebf7' } };

    let row_index = 9;
    let id_curr;
    let total_revenue = 0;
    let total_revenue_before_discount = 0;
    let discount = 0;
    let count = 0;
    let index_curr = 1;
    let budget = 0;


    const worksheet = workbook.addWorksheet
    ('BANG_GIA',{ 
        views: [{ showGridLines: false }],
        pageSetup: { paperSize: 9, orientation: 'landscape' },
        properties: { defaultColWidth: 20, defaultRowHeight: 25 },
    }); 
    worksheet.addRow(['Hệ thống rạp chiếu phim CMS'])
    worksheet.addRow(['04 Nguyễn Văn Bảo, phường 2, quận Gò Vấp, thành phố Hồ Chí Minh'])
    worksheet.addRow(['Ngày xuất báo cáo: ' + new Date().toLocaleDateString()])
    worksheet.addRow(['Nhân viên xuất báo cáo: ' + user?.firstName + " " + user?.lastName])
    worksheet.addRow(['BẢNG GIÁ'])
    worksheet.addRow(['Từ ngày: ' + startDate +"         "+' Đến ngày ' + endDate])
    worksheet.addRow([])
    worksheet.addRow(
        ['STT','Mã khuyến mãi', 'Tên khuyến mãi', 'Ngày bắt đầu','Ngày kết thúc	',
        'SL sử dụng',
         'Chiết khấu','Ngân sách tổng', 'Ngân sách đã dùng', 'Ngân sách còn lại'],
    )
    // set font header
   
    // set border table header
    worksheet.getCell('A8').border = borderAll;
    worksheet.getCell('B8').border = borderAll;
    worksheet.getCell('C8').border = borderAll;
    worksheet.getCell('D8').border = borderAll;
    worksheet.getCell('E8').border = borderAll;
    worksheet.getCell('F8').border = borderAll;
    worksheet.getCell('G8').border = borderAll;
    worksheet.getCell('H8').border = borderAll;
    worksheet.getCell('I8').border = borderAll;
    worksheet.getCell('J8').border = borderAll;

    worksheet.getCell('A8').fill = colorHeader;
    worksheet.getCell('B8').fill = colorHeader;
    worksheet.getCell('C8').fill = colorHeader;
    worksheet.getCell('D8').fill = colorHeader;
    worksheet.getCell('E8').fill = colorHeader;
    worksheet.getCell('F8').fill = colorHeader;
    worksheet.getCell('G8').fill = colorHeader;
    worksheet.getCell('H8').fill = colorHeader;
    worksheet.getCell('I8').fill = colorHeader;
    worksheet.getCell('J8').fill = colorHeader;

    worksheet.mergeCells('A1:C1');
    worksheet.mergeCells('A2:C2');
    worksheet.mergeCells('A3:C3');
    worksheet.mergeCells('A4:C4');

    worksheet.mergeCells('A5:J5');
    worksheet.mergeCells('A6:J6');


    worksheet.columns = [
        { key: 'index', width: 5 },
        { key: 'id', width: 20 },
        { key: 'name', width: 35 },
        { key: 'start_date', width: 20 },
        { key: 'end_date', width: 20 },
        { key: 'count', width: 15 },
        { key: 'discount', width: 20 },
        { key: 'budget', width: 20 },
        { key: 'revenueBeforeDiscount', width: 20 },
        { key: 'revenueAfterDiscount', width: 20 },
    ]

    worksheet.getColumn('count').numFmt = '#,##0';
    worksheet.getColumn('discount').numFmt = '#,##0';
    worksheet.getColumn('budget').numFmt = '#,##0';
    worksheet.getColumn('revenueBeforeDiscount').numFmt = '#,##0';
    worksheet.getColumn('revenueAfterDiscount').numFmt = '#,##0';

    worksheet.getColumn('index').alignment = alignmentLeft;
    worksheet.getColumn('id').alignment = alignmentCenter;

    worksheet.getColumn('index').font = fontNormal;
    worksheet.getColumn('id').font = fontNormal;
    worksheet.getColumn('name').font = fontNormal;
    worksheet.getColumn('start_date').font = fontNormal;
    worksheet.getColumn('end_date').font = fontNormal;
    worksheet.getColumn('count').font = fontNormal;
    worksheet.getColumn('discount').font = fontNormal;
    worksheet.getColumn('revenueBeforeDiscount').font = fontNormal;
    worksheet.getColumn('revenueAfterDiscount').font = fontNormal;

    data.forEach((item, index) => {
        worksheet.addRow({
            index: index + 1,
            id: item?.promotionCode,
            name: item?.desc,
            start_date: moment(item?.startDate).format('DD/MM/YYYY'),
            end_date: moment(item?.endDate).format('DD/MM/YYYY'),
            count: item?.count,
            discount: item?.discount,
            budget: item?.budget,
            revenueBeforeDiscount: item?.totalUsed,
            revenueAfterDiscount: item?.budgetLeft,
        })

        worksheet.getCell('A' + row_index).border = borderAll;
        worksheet.getCell('B' + row_index).border = borderAll;
        worksheet.getCell('C' + row_index).border = borderAll;
        worksheet.getCell('D' + row_index).border = borderAll;
        worksheet.getCell('E' + row_index).border = borderAll;
        worksheet.getCell('F' + row_index).border = borderAll;
        worksheet.getCell('G' + row_index).border = borderAll;
        worksheet.getCell('H' + row_index).border = borderAll;
        worksheet.getCell('I' + row_index).border = borderAll;
        worksheet.getCell('J' + row_index).border = borderAll;

        discount += item?.discount;
        count += item?.count;
        total_revenue_before_discount += item?.totalUsed;
        total_revenue += item?.budgetLeft;
        budget += item?.budget;
        row_index++;
    })


    worksheet.addRow({
        index: 'Tổng cộng',
        name: '',
        start_date: '',
        end_date: '',
        count: count,
        discount: discount,
        budget: budget,
        revenueBeforeDiscount: total_revenue_before_discount,
        revenueAfterDiscount: total_revenue,
    }).font = fontBold;

    worksheet.getCell('A' + row_index).border = borderAll;
    worksheet.getCell('B' + row_index).border = borderAll;
    worksheet.getCell('C' + row_index).border = borderAll;
    worksheet.getCell('D' + row_index).border = borderAll;
    worksheet.getCell('E' + row_index).border = borderAll;
    worksheet.getCell('F' + row_index).border = borderAll;
    worksheet.getCell('G' + row_index).border = borderAll;
    worksheet.getCell('H' + row_index).border = borderAll;
    worksheet.getCell('I' + row_index).border = borderAll;
    worksheet.getCell('J' + row_index).border = borderAll;


    worksheet.getRow(5).font = fontTitle;
    worksheet.getRow(5).alignment = alignmentCenter;
    worksheet.getRow(5).height = 35;

    worksheet.getRow(1).font = fontNormal;
    worksheet.getRow(2).font = fontNormal;
    worksheet.getRow(3).font = fontNormal;
    worksheet.getRow(3).font = fontNormal;
    
    worksheet.getRow(1).alignment = alignmentLeft;
    worksheet.getRow(2).alignment = alignmentLeft;
    worksheet.getRow(3).alignment = alignmentLeft;
    worksheet.getRow(4).alignment = alignmentLeft;



    worksheet.getRow(6).font = fontNormal;
    worksheet.getRow(6).alignment = alignmentCenter;
    worksheet.getRow(8).font = fontBold;
    worksheet.getRow(8).height = 30;
    worksheet.getRow(8).alignment = alignmentCenter;

    const fileName = `TKKM_${new Date().toLocaleDateString()}.xlsx`
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const xls64 = workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: fileType })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
    })
}