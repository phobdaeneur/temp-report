import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { IOil } from "../components/ReportOil";
import moment from "moment";
import { myBase64Image } from "./logoImage";

export default async function <T extends IOil>(
  apiData: T[],
  fileName: string,
  fleetName: string | undefined,
  registration: string | undefined,
  timeStart: string,
  timeEnd: string,
  valueOil: string | undefined
) {
  // Config work book
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Me";
  workbook.lastModifiedBy = "Her";
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);

  // initialize image to workbook
  const imageId2 = workbook.addImage({
    base64: myBase64Image,
    extension: "png",
  });

  const worksheet = workbook.addWorksheet("Oil report all vehicle");

  // add image to work sheet to following cells
  worksheet.addImage(imageId2, `A1:B5`);
  // columns
  /*Column headers*/
  const header = worksheet.getRow(9);
  header.values = [
    "ลำดับ",

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
  ];
  header.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "C4C4C4" },
  };
  header.alignment = {
    horizontal: "center",
    wrapText: true,
    vertical: "middle",
  };

  worksheet.columns = [
    {
      key: "ลำดับ",
      width: 8,
    },

    {
      key: "เวลาเริ่มต้น",
      width: 20,
    },
    {
      key: "เวลาสิ้นสุด",
      width: 20,
    },
    {
      key: "ระยะทาง",
      width: 15,
    },
    {
      key: "น้ำมัน",
      width: 15,
    },
    {
      key: "อัตราสิ้นเปลือง",
      width: 15,
    },
    {
      key: "เวลาเริ่มต้น2",
      width: 20,
    },
    {
      key: "เวลาสิ้นสุด2",
      width: 20,
    },
    {
      key: "ระยะทาง2",
      width: 15,
    },
    {
      key: "น้ำมัน2",
      width: 15,
    },
    {
      key: "อัตราสิ้นเปลือง2",
      width: 15,
    },
    {
      key: "เวลาเริ่มต้น3",
      width: 20,
    },
    {
      key: "เวลาสิ้นสุด3",
      width: 20,
    },
    {
      key: "ระยะทาง3",
      width: 15,
    },
    {
      key: "น้ำมัน3",
      width: 15,
    },
    {
      key: "อัตราสิ้นเปลือง3",
      width: 15,
    },
    {
      key: "อัตราสิ้นเปลืองเฉลี่ย",
      width: 20,
    },
    {
      key: "ประเภทยานยนต์",
      width: 25,
    },
    {
      key: "ราคาน้ำมัน",
      width: 10,
    },
    {
      key: "บริษัทกำหนด",
      width: 30,
    },
  ];

  // rows arrray with coresponding with column name respectively
  const row = apiData.map((row, i) => ({
    ลำดับ: i + 1,
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
  }));

  // const rows = [[3, "Alex", "44"], { id: 4, name: "Margaret", age: 32 }];

  // insert row array
  worksheet.mergeCells("C1:K2");
  const Temp = worksheet.getCell("D1");
  Temp.font = {
    name: "Comic Sans MS",
    family: 4,
    size: 20,
    bold: true,
  };
  Temp.alignment = {
    horizontal: "center",
  };
  Temp.value = "รายงานน้ำมันของยานยนต์ทั้งหมด";

  //Fleet
  worksheet.mergeCells("C4:E4");
  worksheet.getCell("C4").value = "กลุ่มยานยนต์ : " + fleetName;

  //Registration
  worksheet.mergeCells("C5:E5");
  worksheet.getCell("C5").value = "ทะเบียน : " + registration;

  //Time
  worksheet.mergeCells("I4:K4");
  worksheet.getCell("I4").value = "ช่วงเวลาที่เลือก";

  worksheet.mergeCells("I5:K5");
  worksheet.getCell("I5").value =
    "เวลาเริ่มต้น : " + moment.utc(timeStart).format("DD-MM-YYYY HH:mm:ss");

  worksheet.mergeCells("I6:K6");
  worksheet.getCell("I6").value =
    "เวลาสิ้นสุด : " + moment.utc(timeEnd).format("DD-MM-YYYY HH:mm:ss");

  worksheet.mergeCells("B8:F8");
  const Sum1 = worksheet.getCell("B8");
  Sum1.value = "ครั้งที่ 1";
  Sum1.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  Sum1.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F08080" },
  };
  Sum1.alignment = {
    horizontal: "center",
  };

  worksheet.mergeCells("G8:K8");
  const Sum2 = worksheet.getCell("G8");
  Sum2.value = "ครั้งที่ 2";
  Sum2.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  Sum2.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "A2BA7D" },
  };
  Sum2.alignment = {
    horizontal: "center",
  };

  worksheet.mergeCells("L8:P8");
  const Sum3 = worksheet.getCell("L8");
  Sum3.value = "ครั้งที่ 3";
  Sum3.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  Sum3.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "92BCD4" },
  };
  Sum3.alignment = {
    horizontal: "center",
  };

  worksheet.addRows(row);

  for (let n = 10; n < apiData.length + 10; n++) {
    worksheet.getRow(n).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getRow(n).alignment = {
      horizontal: "center",
    };
  }
  // generate excel
  await workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });
    saveAs(blob, fileName + ".xlsx");
  });
}
