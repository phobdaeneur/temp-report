import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IOil } from "../components/ReportOil";
import moment from "moment";
import { fontMaitree } from "../assets/font/fontMitree";
import MaliFont from "../assets/font/Mali-Medium.ttf";
import _ from "lodash";
import logo from "../images/logo.png";

const generatePDFOilReportByFleet = (
  arr: IOil[],
  fileName: string,
  fleetName: string | undefined,
  timeStart: string,
  timeEnd: string,
  valueOil: string | undefined
) => {
  const doc = new jsPDF("l", "mm", [297, 210]);

  doc.addFileToVFS("Maitree.ttf", fontMaitree);
  doc.addFont("Maitree.ttf", "Maitree", "normal");
  doc.setFont("Maitree");
  doc.addImage(logo, "JPEG", 15, 5, 50, 32);
  doc.setFontSize(20);
  doc.text("Oil report for all vehicle", 105, 40);
  doc.setFontSize(12);
  doc.text("กลุ่มยานยนต์ :", 35, 50);
  doc.text(fleetName ? fleetName : fileName, 70, 50);
  doc.text("ช่วงเวลาที่กำหนด", 185, 50);
  doc.text("เวลาเริ่มต้น :", 185, 55);
  doc.text(moment.utc(timeStart).format("DD-MM-YYYY HH:mm:ss"), 215, 55);
  doc.text("เวลาสิ้นสุด :", 185, 60);
  doc.text(moment.utc(timeEnd).format("DD-MM-YYYY HH:mm:ss"), 215, 60);

  var res: Array<string[]> = [];
  arr.map((row: IOil, key) => {
    let r = {};
    for (var i in row) {
      r = {
        ลำดับ: key + 1,
        ทะเบียนรถ: row.registration,
        เวลาเริ่มต้น:
          row.timeStart1.toString() === "-"
            ? "-"
            : moment.utc(row.timeStart1).format("DD-MM-YYYY HH:mm:ss"),
        เวลาสิ้นสุด:
          row.timeEnd1.toString() === "-"
            ? "-"
            : moment.utc(row.timeEnd1).format("DD-MM-YYYY HH:mm:ss"),
        ระยะทาง: row.dis1,
        น้ำมัน: row.oil1.toString() === "-" ? "-" : row.oil1,
        อัตราสิ้นเปลือง:
          row.oil1.toString() === "0"
            ? "-"
            : row.oil1.toString() === "-"
            ? "-"
            : isNaN(parseFloat(row.dis1) / parseInt(row.oil1))
            ? "0.000"
            : (parseFloat(row.dis1) / Math.abs(parseInt(row.oil1))).toFixed(3),

        เวลาเริ่มต้น2:
          row.timeStart2.toString() === "-"
            ? "-"
            : moment.utc(row.timeStart2).format("DD-MM-YYYY HH:mm:ss"),
        เวลาสิ้นสุด2:
          row.timeEnd2.toString() === "-"
            ? "-"
            : moment.utc(row.timeEnd2).format("DD-MM-YYYY HH:mm:ss"),
        ระยะทาง2: row.dis2,
        น้ำมัน2: row.oil2.toString() === "-" ? "-" : row.oil2,
        อัตราสิ้นเปลือง2:
          row.oil2.toString() === "0"
            ? "-"
            : row.oil2.toString() === "-"
            ? "-"
            : isNaN(parseFloat(row.dis2) / parseInt(row.oil2))
            ? "0.000"
            : (parseFloat(row.dis2) / Math.abs(parseInt(row.oil2))).toFixed(3),

        เวลาเริ่มต้น3:
          row.timeStart3.toString() === "-"
            ? "-"
            : moment.utc(row.timeStart3).format("DD-MM-YYYY HH:mm:ss"),
        เวลาสิ้นสุด3:
          row.timeEnd3.toString() === "-"
            ? "-"
            : moment.utc(row.timeEnd3).format("DD-MM-YYYY HH:mm:ss"),
        ระยะทาง3: row.dis3,
        น้ำมัน3: row.oil3.toString() === "-" ? "-" : row.oil3,
        อัตราสิ้นเปลือง3:
          row.oil3.toString() === "0"
            ? "-"
            : row.oil3.toString() === "-"
            ? "-"
            : isNaN(parseFloat(row.dis3) / parseInt(row.oil3))
            ? "0.000"
            : (parseFloat(row.dis3) / Math.abs(parseInt(row.oil3))).toFixed(3),

        อัตราสิ้นเปลืองเฉลี่ย:
          row.oil1.toString() === "-" ||
          row.oil1.toString() === "0" ||
          row.oil2.toString() === "0" ||
          row.oil3.toString() === "0"
            ? "-"
            : row.oil2.toString() === "-"
            ? isNaN(parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)))
              ? "0.000"
              : (parseFloat(row.dis1) / Math.abs(parseInt(row.oil1))).toFixed(3)
            : row.oil3.toString() === "-"
            ? (
                (isNaN(parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)))
                  ? 0 + parseFloat(row.dis2) / Math.abs(parseInt(row.oil2))
                  : parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)) +
                    parseFloat(row.dis2) / Math.abs(parseInt(row.oil2))) /
                row.average
              ).toFixed(3)
            : (
                (isNaN(parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)))
                  ? 0 +
                    parseFloat(row.dis2) / Math.abs(parseInt(row.oil2)) +
                    parseFloat(row.dis3) / Math.abs(parseInt(row.oil3))
                  : parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)) +
                    parseFloat(row.dis2) / Math.abs(parseInt(row.oil2)) +
                    parseFloat(row.dis3) / Math.abs(parseInt(row.oil3))) /
                row.average
              ).toFixed(3),
        ประเภทยานยนต์:
          row.veh_type.toString() === "0"
            ? "โปรดระบุประเภทของยานยนต์"
            : row.veh_type,

        ราคาน้ำมัน: valueOil,

        บริษัทกำหนด:
          row.oil1.toString() === "-" ||
          row.oil1.toString() === "0" ||
          row.oil2.toString() === "0" ||
          row.oil3.toString() === "0"
            ? "-"
            : row.oil2.toString() === "-"
            ? isNaN(parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)))
              ? "0.000"
              : (
                  (parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)) -
                    parseFloat(row.veh_type_value)) *
                  parseFloat(valueOil ? valueOil : "0")
                ).toFixed(1)
            : row.oil3.toString() === "-"
            ? (
                ((parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)) +
                  parseFloat(row.dis2) / Math.abs(parseInt(row.oil2))) /
                  row.average -
                  parseFloat(row.veh_type_value)) *
                parseFloat(valueOil ? valueOil : "0")
              ).toFixed(1)
            : (
                ((parseFloat(row.dis1) / Math.abs(parseInt(row.oil1)) +
                  parseFloat(row.dis2) / Math.abs(parseInt(row.oil2)) +
                  parseFloat(row.dis3) / Math.abs(parseInt(row.oil3))) /
                  row.average -
                  parseFloat(row.veh_type_value)) *
                parseFloat(valueOil ? valueOil : "0")
              ).toFixed(1),
      };
    }
    res.push(Array.from(Object.values(r)));
  });

  autoTable(doc, {
    head: [
      [
        "ลำดับ",
        "ทะเบียนรถ",
        "เวลาเริ่มต้น",
        "เวลาสิ้นสุด",
        "ระยะทาง (กม.)",
        "น้ำมัน (ลิตร)",
        "อัตราสิ้นเปลือง (กม. / ลิตร)",
        "เวลาเริ่มต้น",
        "เวลาสิ้นสุด",
        "ระยะทาง (กม.)",
        "น้ำมัน (ลิตร)",
        "อัตราสิ้นเปลือง (กม. / ลิตร)",
        "เวลาเริ่มต้น",
        "เวลาสิ้นสุด",
        "ระยะทาง (กม.)",
        "น้ำมัน (ลิตร)",
        "อัตราสิ้นเปลือง (กม. / ลิตร)",
        "อัตราสิ้นเปลืองเฉลี่ย",
        "ประเภทยานยนต์",
        "ราคาน้ำมัน",
        "บริษัทกำหนด (กม. / ลิตร)",
      ],
    ],
    body: res,
    margin: { top: 70 },
    didDrawPage: function (data) {
      data.settings.margin.top = 10;
    },
    styles: {
      font: "Maitree",
      fontSize: 5,
      halign: "center", // left, center, right
      valign: "middle",
    },
    headStyles: {
      halign: "center",
      valign: "middle",
    },
    theme: "grid",
  });

  doc.save(fileName);
};

export { generatePDFOilReportByFleet };
