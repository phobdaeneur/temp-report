import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IVehicleReport } from "../components/TempReport";
import moment from "moment";
import { preDistance } from "./preDistance";
import { analog } from "./Analog";
import { fontMaitree } from "../assets/font/fontMitree";
import MaliFont from "../assets/font/Mali-Medium.ttf";
import _ from "lodash";
import { fontSize } from "@mui/system";
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

const generatePDF = (
  arr: IVehicleReport[],
  fileName: string,
  fleetName: string | undefined,
  min1: string,
  max1: string,
  averageTemp1: string,
  min2: string,
  max2: string,
  averageTemp2: string
) => {
  const doc = new jsPDF();

  doc.addFileToVFS("Maitree.ttf", fontMaitree);
  doc.addFont("Maitree.ttf", "Maitree", "normal");
  doc.setFont("Maitree");
  doc.addImage(logo, "JPEG", 15, 5, 50, 32);
  doc.setFontSize(20);
  doc.text("รายงานอุณหภูมิ", 80, 40);
  doc.setFontSize(14);
  doc.text("สรุปข้อมูลรายงาน", 15, 65);
  doc.setFontSize(8);
  doc.text("กลุ่มยานยนต์ :", 15, 50);
  doc.text(fleetName ? fleetName : fileName, 45, 50);
  doc.text("ทะเบียน :", 15, 55);
  doc.text(arr[0].reg_no, 45, 55);

  doc.text("ช่วงเวลาที่กำหนด", 135, 50);
  doc.text("เวลาเริ่มต้น :", 135, 55);
  doc.text(
    moment.utc(arr[0].local_timestamp).format("DD-MM-YYYY HH:mm:ss"),
    155,
    55
  );
  doc.text("เวลาสิ้นสุด :", 135, 60);
  doc.text(
    moment
      .utc(arr[arr.length - 1].local_timestamp)
      .format("DD-MM-YYYY HH:mm:ss"),
    155,
    60
  );

  doc.text("ระยะทางรวม :", 15, 70);
  doc.text(
    parseFloat(arr[arr.length - 1].distance)
      .toFixed(3)
      .toString(),
    40,
    70
  );
  doc.text("กิโลเมตร", 55, 70);

  doc.text("อุณหภูมิ 1", 15, 75);
  doc.text("อุณหภูมิสูงสุด :", 15, 80);
  doc.text(max1, 45, 80);
  doc.text("องศาเซลเซียส", 55, 80);

  doc.text("อุณหภูมิต่ำสุด :", 15, 85);
  doc.text(min1, 45, 85);
  doc.text("องศาเซลเซียส", 55, 85);

  doc.text("อุณหภูมิเฉลี่ย :", 15, 90);
  doc.text(averageTemp1, 45, 90);
  doc.text("องศาเซลเซียส", 55, 90);

  doc.text("อุณหภูมิ 2", 135, 75);
  doc.text("อุณหภูมิสูงสุด :", 135, 80);
  doc.text(max2, 165, 80);
  doc.text("องศาเซลเซียส", 175, 80);

  doc.text("อุณหภูมิต่ำสุด :", 135, 85);
  doc.text(min2, 165, 85);
  doc.text("องศาเซลเซียส", 175, 85);

  doc.text("อุณหภูมิเฉลี่ย :", 135, 90);
  doc.text(averageTemp2, 165, 90);
  doc.text("องศาเซลเซียส", 175, 90);
  const columnHead = Object.keys(arr[0]);

  var res: Array<string[]> = [];
  arr.map((item: IVehicleReport, key) => {
    let r = {};
    for (var i in item) {
      r = {
        ลำดับ: key + 1,
        สถานะ: statusEnToth(item.Status),
        สถานที่: item.name,
        เวลา: moment.utc(item.local_timestamp).format("DD-MM-YYYY HH:mm:ss"),
        ละติจูด: parseFloat(item.lat).toFixed(5),
        ลองติจูด: parseFloat(item.lon).toFixed(5),
        ความเร็ว: item.speed,
        น้ำมัน: analog(
          item.max_fuel_voltage,
          item.max_fuel,
          item.analog,
          item.max_empty_voltage
        ),
        อุณหภูมิ1: item.Temp1,
        อุณหภูมิ2: item.Temp2,
        ระยะทาง:
          item.distance === null
            ? preDistance(arr, key)
            : parseFloat(item.distance).toFixed(3),
      };
    }
    res.push(Array.from(Object.values(r)));
  });

  autoTable(doc, {
    head: [
      [
        "ลำดับ",
        "สถานะ",
        "สถานที่",
        "เวลา",
        "ละติจูด",
        "ลองติจูด",
        "ความเร็ว",
        "น้ำมัน",
        "อุณหภูมิ1",
        "อุณหภูมิ2",
        "ระยะทาง",
      ],
    ],
    body: res,
    margin: { top: 100 },
    didDrawPage: function (data) {
      data.settings.margin.top = 10;
    },
    styles: {
      font: "Maitree",
      fontSize: 5,
    },
    headStyles: {
      halign: "center",
    },
    theme: "grid",
  });

  doc.save(fileName);
};
export { generatePDF };
