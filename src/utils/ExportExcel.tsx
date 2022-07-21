import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx-pro";
import * as XLSX from "sheetjs-style";
import { IVehicleReport } from "../components/TempReport";
import moment from "moment";
import { preDistance } from "./preDistance";
import { analog } from "./Analog";
import logo from "../images/logo.png";
const statusEnToth = (str: string): string => {
  switch (str) {
    case "ENGINE OFF":
      return "ดับเครื่องยนต์";
    case "ENGINE ON":
      return "ติดเครื่องยนต์";
    case "OFFLINE":
      return "ไม่มีสัญญาน";
    case "IDLE":
      return "จอดติดเครื่องยนต์";
    case "SPEEDING":
      return "ความเร็วเกินกำหนด";
    case "LOCATION":
      return "โลเคชั่น";
    case "NORMAL":
      return "สถานะปกติ";
    default:
      return "ไม่สามารถระบุได้";
  }
};

export const ExportToExcel = <T extends IVehicleReport>(
  apiData: T[],
  fileName: string,
  fleetName: string | undefined,
  min1: string,
  max1: string,
  averageTemp1: string,
  min2: string,
  max2: string,
  averageTemp2: string
) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const row = apiData.map((row, i) => ({
    ลำดับ: i + 1,
    สถานะ: statusEnToth(row.Status),
    สถานที่: row.name,
    เวลา: moment.utc(row.local_timestamp).format("DD-MM-YYYY HH:mm:ss"),
    ละติจูด: parseFloat(row.lat).toFixed(5),
    ลองติจูด: parseFloat(row.lon).toFixed(5),
    ความเร็ว: row.speed,
    น้ำมัน: analog(
      row.max_fuel_voltage,
      row.max_fuel,
      row.analog,
      row.max_empty_voltage
    ),
    อุณหภูมิ1: row.Temp1,
    อุณหภูมิ2: row.Temp2,
    ระยะทาง:
      row.distance === null
        ? preDistance(apiData, i)
        : parseFloat(row.distance).toFixed(3),
  }));

  var wscols = [
    { wch: 5 },
    { wch: 15 },
    { wch: 80 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 8 },
    { wch: 5 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
  ];

  var wsrows = {
    alignment: {
      horizontal: "center",
      wrapText: true,
    },
    border: {
      top: { style: "thin", color: { rgb: "00000000" } },
      bottom: { style: "thin", color: { rgb: "00000000" } },
      rigth: { style: "thin", color: { rgb: "00000000" } },
      left: { style: "thin", color: { rgb: "00000000" } },
    },
    fill: {
      patternType: "solid",
      fgColor: { theme: 5, tint: 0.3999755851924192 },
      bgColor: { indexed: 64 },
    },
  };

  var arr: Array<string> = [];
  const exportToCSV = (apiData: T[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(arr);
    // XLSX.utils.sheet_add_aoa(ws, { logo }, { origin: "A1" });
    XLSX.utils.sheet_add_aoa(ws, [["รายงานอุณหูมิ"]], {
      origin: "A1",
    });
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "กลุ่มยานยนต์ : " +
            fleetName +
            "           ทะเบียน : " +
            apiData[0].reg_no,
        ],
      ],
      {
        origin: "C2",
      }
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "ช่วงเวลาที่เลือก",
          "เวลาเริ่มต้น : " +
            moment
              .utc(apiData[0].local_timestamp)
              .format("DD-MM-YYYY HH:mm:ss") +
            "       เวลาสิ้นสุด : " +
            moment
              .utc(apiData[apiData.length - 1].local_timestamp)
              .format("DD-MM-YYYY HH:mm:ss"),
        ],
      ],
      {
        origin: "B3",
      }
    );

    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Temp 1 ",
          "อุณหภูมิสูงสุด : " +
            max1 +
            " เซลเซียส" +
            "   อุณหภูมิต่ำสุด : " +
            min1 +
            " เซลเซียส" +
            "   อุณหภูมิเฉลี่ย : " +
            averageTemp1 +
            " เซลเซียส",
        ],
      ],
      {
        origin: "B4",
      }
    );
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Temp 2 ",
          "อุณหภูมิสูงสุด : " +
            max2 +
            " เซลเซียส" +
            "   อุณหภูมิต่ำสุด : " +
            min2 +
            " เซลเซียส" +
            "   อุณหภูมิเฉลี่ย : " +
            averageTemp2 +
            " เซลเซียส",
        ],
      ],
      {
        origin: "B5",
      }
    );

    XLSX.utils.sheet_add_json(ws, row, { origin: "A7" });

    for (let i in ws) {
      if (typeof ws[i] != "object") continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        alignment: {
          // vertical: "center",
          // horizontal: "center",
          wrapText: true, // any truthy value here
        },
        border: {
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
          top: {
            style: "thin",
            color: "000000",
          },
          bottom: {
            style: "thin",
            color: "000000",
          },
        },
      };
    }

    ws["A1"].s = {
      font: {
        sz: 24,
        bold: true,
      },
    };
    ws["!cols"] = wscols;
    ws["A7"].s = wsrows;
    ws["B7"].s = wsrows;
    ws["C7"].s = wsrows;
    ws["D7"].s = wsrows;
    ws["E7"].s = wsrows;
    ws["F7"].s = wsrows;
    ws["G7"].s = wsrows;
    ws["H7"].s = wsrows;
    ws["I7"].s = wsrows;
    ws["J7"].s = wsrows;
    ws["K7"].s = wsrows;
    // ws["!rows"] = wsrows;
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (): void => {
    exportToCSV(apiData, fileName);
  };
};
