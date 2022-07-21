import React, { Component } from "react";
// import DataGrid, {
//   Column,
//   Export,
//   GroupPanel,
// } from "devextreme-react/data-grid";
// import Button from "devextreme-react/button";
// import ExcelJS from "exceljs";
// import saveAs from "file-saver";
// import { IVehicleReport } from "../components/TempReport";
// import moment from "moment";
// import { preDistance } from "./preDistance";
// import { analog } from "./Analog";
// import logo from "../images/logo.png";
// const statusEnToth = (str: string): string => {
//   switch (str) {
//     case "ENGINE OFF":
//       return "ดับเครื่องยนต์";
//     case "ENGINE ON":
//       return "ติดเครื่องยนต์";
//     case "OFFLINE":
//       return "ไม่มีสัญญาน";
//     case "IDLE":
//       return "จอดติดเครื่องยนต์";
//     case "SPEEDING":
//       return "ความเร็วเกินกำหนด";
//     case "LOCATION":
//       return "โลเคชั่น";
//     case "NORMAL":
//       return "สถานะปกติ";
//     default:
//       return "ไม่สามารถระบุได้";
//   }
// };

// export const GenToExcel = <T extends IVehicleReport>(
//   apiData: T[],
//   fileName: string,
//   fleetName: string | undefined,
//   min1: string,
//   max1: string,
//   averageTemp1: string,
//   min2: string,
//   max2: string,
//   averageTemp2: string
// ) => {
//   const row = apiData.map((row, i) => ({
//     ลำดับ: i + 1,
//     สถานะ: statusEnToth(row.Status),
//     สถานที่: row.name,
//     เวลา: moment.utc(row.local_timestamp).format("DD-MM-YYYY HH:mm:ss"),
//     ละติจูด: parseFloat(row.lat).toFixed(5),
//     ลองติจูด: parseFloat(row.lon).toFixed(5),
//     ความเร็ว: row.speed,
//     น้ำมัน: analog(
//       row.max_fuel_voltage,
//       row.max_fuel,
//       row.analog,
//       row.max_empty_voltage
//     ),
//     อุณหภูมิ1: row.Temp1,
//     อุณหภูมิ2: row.Temp2,
//     ระยะทาง:
//       row.distance === null
//         ? preDistance(apiData, i)
//         : parseFloat(row.distance).toFixed(3),
//   }));
//   const excelExport = (DataGrid: any) => {
//     var ExcelJSWorkbook = new ExcelJS.Workbook();
//     var worksheet = ExcelJSWorkbook.addWorksheet("ExcelJS sheet");
//     var columns = DataGrid.getVisibleColumns();

//     worksheet.mergeCells("A2:I2");

//     const customCell = worksheet.getCell("A2");
//     customCell.font = {
//       name: "Comic Sans MS",
//       family: 4,
//       size: 20,
//       underline: true,
//       bold: true,
//     };

//     customCell.value = "Custom header here";

//     var headerRow = worksheet.addRow();
//     // worksheet.getRow(4).font = { bold: true };

//     for (let i = 0; i < columns.length; i++) {
//       let currentColumnWidth = DataGrid.option().columns[i].width;
//       worksheet.getColumn(i + 1).width =
//         currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
//       let cell = headerRow.getCell(i + 1);
//       cell.value = columns[i].caption;
//     }

//     if (this.state.excelFilterEnabled === true) {
//       worksheet.autoFilter = {
//         from: {
//           row: 3,
//           column: 1,
//         },
//         to: {
//           row: 3,
//           column: columns.length,
//         },
//       };
//     }

//     DataGrid.getController("data")
//       .loadAll()
//       .then(function (row:IVehicleReport[],fileName:string) {
//         for (let i = 0; i < apiData.length; i++) {
//           var dataRow = worksheet.addRow();
//           if (apiData[i].rowType === "data") {
//             dataRow.outlineLevel = 1;
//           }
//           for (let j = 0; j < apiData[i].values.length; j++) {
//             let cell = dataRow.getCell(j + 1);
//             cell.value = apiData[i].values[j];
//           }
//         }

//         const rowCount = worksheet.rowCount;
//         worksheet.mergeCells(`A${rowCount}:I${rowCount + 1}`);
//         worksheet.getRow(1).font = { bold: true };
//         worksheet.getCell(`A${rowCount}`).font = {
//           name: "Comic Sans MS",
//           family: 4,
//           size: 20,
//           underline: true,
//           bold: true,
//         };

//         // worksheet.getCell(`A${rowCount}`).value = "Custom Footer here";

//         ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
//           saveAs(
//             new Blob([buffer], { type: "application/octet-stream" }),
//             `${DataGrid.option().export.fileName}.xlsx`
//           );
//         });
//       });
//   };
// };
