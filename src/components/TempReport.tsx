import React, {
  useState,
  useContext,
  Fragment,
  useRef,
  useEffect,
} from "react";
import useSWR from "swr"; // swr [Stale While Revalidate] 1. ทำการดึง data จาก cache มาให้เราก่อน (stale) 2. จากนั้นก็ ยิง request ไปที่ API (revalidate) 3. นำข้อมูลจาก API ที่ได้มาอัพเดทกับข้อมูลเดิม
import Select, { SingleValue } from "react-select";
import axios, { AxiosRequestConfig } from "axios";
import { StoreContext } from "../store";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";
import temp from "../images/temp.svg";
import excel from "../images/excel.svg";
import pdf from "../images/pdf.svg";
import { preDistance } from "../utils/preDistance";
import { ISelect } from "../views/Home";
import { analog } from "../utils/Analog";
import { generatePDF } from "../utils/ExportPDF";
import excelize from "../utils/excelize";

export interface IVehicle {
  fleet_id: number;
  veh_id: number;
  registration: string;
}

export interface IVehicleReport {
  Count_Temp1: number;
  Count_Temp2: number;
  Count_Temp3: number;
  Count_Temp4: number;
  event: string;
  name: string;
  reg_no: string;
  veh_id: string;
  local_timestamp: string;
  lat: string;
  lon: string;
  speed: string;
  analog: number;
  Temp1: string;
  Temp2: string;
  Temp3: string;
  Temp4: string;
  distance: string;
  Status: string;
  max_empty_voltage: number;
  max_fuel: number;
  max_fuel_voltage: number;
}

export interface IVehicleSelect {
  label: string;
  value: string;
}

const fetcher = async (url: string, config: AxiosRequestConfig) => {
  try {
    const r = await axios.get(url, config);
    return r.data;
  } catch (error) {
    console.log(error);
  }
};

interface Props {
  selectFleet: ISelect | null;
}
function TempReport({ selectFleet }: Props) {
  const { user } = useContext(StoreContext);
  const [selectVehicle, setSelectVehicle] = useState<IVehicleSelect | null>(
    null
  );

  // Date start
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const handleDateStartChange = (newDateStart: Date | null) => {
    setDateStart(newDateStart);
  };

  //Date end
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const handleDateEndChange = (newDateEnd: Date | null) => {
    setDateEnd(newDateEnd);
  };

  // Convert date start
  const dateStartChange = moment(dateStart).format("YYYY-MM-DD HH:mm:ss");
  // console.log(dateStartChange);

  // Convert date end
  const dateEndChange = moment(dateEnd).format("YYYY-MM-DD HH:mm:ss");
  // console.log(dateEndChange);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  /**
   * Retrive Vehicles
   */
  const { data: vehicleData, error: vehicleError } = useSWR(
    [
      `https://geotrackerbackend.kratostracking.com:5000/api/fleet/vehicles/${selectFleet?.value}`,
      config,
    ],
    fetcher
  );

  /**
   *
   * Retrive report vehicle
   */
  const [shouldFetch, setShouldFetch] = React.useState(false);
  function handleSearchReport() {
    setShouldFetch(true);
  }
  const { data: vehicleReportData, error: vehicleReportError } = useSWR(
    [
      shouldFetch
        ? `https://geotrackerbackend.kratostracking.com:5000/api/fleet/vehicleReport/${selectVehicle?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );
  // console.log(vehicleReportData);
  useEffect(() => {
    setShouldFetch(false);
  }, [selectVehicle?.value, dateStartChange, dateEndChange]);

  // Select dropdown vehicle
  const handleselectVehicle = (newVehicle: SingleValue<IVehicleSelect>) => {
    //console.log(newVehicle);
    setSelectVehicle(newVehicle);
  };

  // Vehicle data in dropdown
  const optionVehicle = vehicleData
    ? vehicleData.map((item: IVehicle, i: number) => {
        return { value: item.veh_id, label: item.registration };
      })
    : undefined;

  const sum1 = vehicleReportData
    ? vehicleReportData.reduce((acc: number, cur: IVehicleReport) => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          return acc + (isNaN(+cur.Temp1) ? 0 : +cur.Temp1);
        }
      }, 0)
    : undefined;

  const averageTemp1 =
    sum1 / (vehicleReportData ? vehicleReportData[0]?.Count_Temp1 : null);
  // console.log(averageTemp1);
  //Max1
  const max1 = vehicleReportData
    ? vehicleReportData.map(() => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          let arr = [];
          const n = vehicleReportData.values();
          for (let a of n) {
            arr.push(a.Temp1);
          }
          return Math.max(...arr.map((item) => (isNaN(item) ? 0 : item)));
        }
      })
    : undefined;
  //Min1
  const min1 = vehicleReportData
    ? vehicleReportData.map(() => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          let arr = [];
          const n = vehicleReportData.values();
          for (let a of n) {
            arr.push(a.Temp1);
          }
          return Math.min(
            ...arr.map((item) => (isNaN(+item) ? 1000 : +item))
          ) === 1000
            ? 0
            : Math.min(...arr.map((item) => (isNaN(+item) ? 1000 : +item)));
        }
      })
    : undefined;

  //averageTemp2
  const sum2 = vehicleReportData
    ? vehicleReportData.reduce((acc: number, cur: IVehicleReport) => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          return acc + (isNaN(+cur.Temp2) ? 0 : +cur.Temp2);
        }
      }, 0)
    : undefined;

  const averageTemp2 =
    sum2 / (vehicleReportData ? vehicleReportData[0]?.Count_Temp2 : null);

  //Max2
  const max2 = vehicleReportData
    ? vehicleReportData.map(() => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          let arr = [];
          const n = vehicleReportData.values();
          for (let a of n) {
            arr.push(a.Temp2);
          }
          return Math.max(...arr.map((item) => (isNaN(+item) ? 0 : +item)));
        }
      })
    : undefined;

  //Min2
  const min2 = vehicleReportData
    ? vehicleReportData.map(() => {
        if (vehicleReportData === undefined || vehicleReportData === null) {
          return;
        } else {
          let arr = [];
          const n = vehicleReportData.values();
          for (let a of n) {
            arr.push(a.Temp2);
          }

          return Math.min(
            ...arr.map((item) => (isNaN(+item) ? 1000 : +item))
          ) === 1000
            ? 0
            : Math.min(...arr.map((item) => (isNaN(+item) ? 1000 : +item)));
          // return Math.min(...arr.map((item) => (isNaN(+item) ? 1000 : +item)));
        }
      })
    : undefined;

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
  const dateTime = moment(dateStart).format("DD-MM-YYYY");
  const fileName = dateTime + " " + selectVehicle?.label;

  function handleGenPDF() {
    console.log("fire Gen PDF");
    generatePDF(
      vehicleReportData,
      fileName,
      selectFleet?.label,
      min1[0].toFixed(1).toString(),
      max1[0].toFixed(1).toString(),
      averageTemp1 ? averageTemp1.toFixed(1).toString() : "0.0",
      min2[0].toFixed(1).toString(),
      max2[0].toFixed(1).toString(),
      averageTemp2 ? averageTemp2.toFixed(1).toString() : "0.0"
    );
  }

  function handleGenExcel() {
    console.log("fire Gen Excel");
    excelize(
      vehicleReportData,
      fileName,
      selectFleet?.label,
      min1[0].toFixed(1).toString(),
      max1[0].toFixed(1).toString(),
      averageTemp1 ? averageTemp1.toFixed(1).toString() : "0.0",
      min2[0].toFixed(1).toString(),
      max2[0].toFixed(1).toString(),
      averageTemp2 ? averageTemp2.toFixed(1).toString() : "0.0"
    );
  }
  return (
    <div className=" flex flex-col dark:bg-black gap-10">
      <div className="flex flex-col sticky top-32 z-10 w-full px-5 dark:bg-black bg-white">
        <div className="flex flex-col pt-4 md:flex-row justify-between items-center  gap-4 w-full px-5">
          {/* Deopdown vehicle */}
          <div className=" flex flex-row gap-5 items-center">
            <Select
              onChange={handleselectVehicle}
              placeholder={"กรุณาเลือกยานยนต์"}
              className="w-60 "
              options={optionVehicle}
              value={selectVehicle}
              isClearable
            />
          </div>

          {/* Date time */}
          <div className="flex flex-row gap-4 ">
            <div className="dark:bg-white dark:rounded-xl">
              {/* Date start */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="เวลาเริ่มต้น"
                  ampm={false}
                  value={dateStart}
                  onChange={handleDateStartChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* Date start */}
            </div>

            <div className="dark:bg-white dark:rounded-xl">
              {/* Date end */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="เวลาสิ้นสุด"
                  ampm={false}
                  value={dateEnd}
                  onChange={handleDateEndChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* Date end */}
            </div>

            <button
              className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-purple-500 hover:border-purple-600 hover:bg-purple-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
              disabled={shouldFetch}
              onClick={handleSearchReport}
            >
              <span className="mx-auto">ค้นหา</span>
            </button>
          </div>
          {/* Date time */}
        </div>
        {/* Summary gard */}

        <div className="w-full px-5">
          <div className="widget w-full p-4 rounded-lg bg-white border-l-4 border-purple-400 shadow-lg dark:bg-black dark:shadow-md dark:shadow-purple-300">
            {vehicleReportData === undefined || !vehicleReportData.length ? (
              <div className=" text-3xl text-center dark:text-white">
                กรุณาระบุข้อมูลให้ครบถ้วนเเล้วกดปุ่มค้นหาเพื่อเเสดงข้อมูลรายงาน
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <div className=" bg-purple-400 text-white rounded-full mr-3">
                  <img src={temp} className="h-12 mx-auto " />
                </div>
                {/* Size md  */}

                <div className="md:flex hidden md:flex-col justify-between text-slate-600 font-mono dark:text-gray-300 w-full pr-20">
                  <div className="flex flex-row gap-6 items-center justify-between ">
                    <div className="text-xl">สรุปข้อมูลรายงาน</div>
                    <div className="text-base ">
                      ระยะทางรวม :{" "}
                      {parseFloat(
                        vehicleReportData
                          ? vehicleReportData[vehicleReportData.length - 1]
                              ?.distance
                          : undefined
                      ).toFixed(3)}{" "}
                      กิโลเมตร
                    </div>
                    <div className=" flex flex-row gap-5">
                      <button
                        className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-green-500 hover:border-green-600 hover:bg-green-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                        onClick={handleGenExcel}
                      >
                        <img src={excel} className=" h-6 mx-auto " />
                      </button>
                      <button
                        className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-red-500 hover:border-red-600 hover:bg-red-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                        onClick={handleGenPDF}
                      >
                        <img src={pdf} className=" h-6 mx-auto " />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row gap-6 justify-between">
                    <div className="text-base underline decoration-yellow-500 decoration-4 ">
                      อุณหภูมิ 1
                    </div>
                    <div className="text-base">
                      ค่าอุณหภูมิสูงสุด :{" "}
                      {parseFloat(max1 ? max1[0] : undefined).toFixed(1)}
                    </div>
                    <div className="text-base">
                      ค่าอุณหภูมิต่ำสุด :{" "}
                      {parseFloat(min1 ? min1[0] : undefined).toFixed(1)}
                    </div>
                    <div className="text-base">
                      ค่าอุณหภูมิเฉลี่ย :{" "}
                      {isNaN(averageTemp1) ? "0.0" : averageTemp1.toFixed(1)}
                    </div>
                  </div>

                  <div className="flex flex-row gap-6 justify-between">
                    <div className="text-base underline decoration-sky-500 decoration-4 ">
                      อุณหภูมิ 2
                    </div>
                    <div className="text-base ">
                      ค่าอุณหภูมิสูงสุด :{" "}
                      {parseFloat(max2 ? max2[0] : undefined).toFixed(1)}
                    </div>
                    <div className="text-base ">
                      ค่าอุณหภูมิต่ำสุด :{" "}
                      {parseFloat(min2 ? min2[0] : undefined).toFixed(1)}
                    </div>
                    <div className="text-base ">
                      ค่าอุณหภูมิเฉลี่ย :{" "}
                      {isNaN(averageTemp2) ? "0.0" : averageTemp2.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Summary gard */}
      </div>

      <section className="container font-mono px-10 ">
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full ">
            <table className="w-full font-mono text-center">
              <thead className=" text-md  text-gray-800 bg-[#B3BBA5] dark:bg-[#059669] w-full ">
                <tr className="flex items-center w-full">
                  <th className=" w-28 ">ลำดับ </th>
                  <th className=" w-1/5 ">สถานะ </th>
                  <th className=" w-1/2 ">สถานที่</th>
                  <th className=" w-1/5 ">เวลา</th>
                  <th className=" w-1/5 ">ละติจูด</th>
                  <th className=" w-1/5 ">ลองติจูด</th>
                  <th className=" w-1/5 ">ความเร็ว</th>
                  <th className=" w-1/5 ">
                    น้ำมัน <br></br> {"(ลิตร)"}
                  </th>
                  <th className=" w-1/5 ">
                    อุณหภูมิ1 <br></br> {"(องศา)"}
                  </th>
                  <th className=" w-1/5 ">
                    อุณหภูมิ2 <br></br> {"(องศา)"}
                  </th>
                  {/* <th className=" w-1/5 sticky">Temp3</th>
                      <th className=" w-1/5 sticky">Temp4</th> */}
                  <th className=" w-1/5 ">
                    ระยะทาง <br></br> {"(กิโลเมตร)"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white flex flex-col items-center justify-between overflow-y-scroll w-full h-80">
                {!vehicleReportData
                  ? null
                  : vehicleReportData.map((item: IVehicleReport, i: number) => (
                      <tr className="text-gray-700 flex w-full">
                        <td className=" w-28 sticky text-sm border">{i + 1}</td>
                        <td className=" w-1/5 sticky text-sm border">
                          {statusEnToth(item.Status)}
                        </td>
                        <td className=" w-1/2 sticky text-sm border">
                          {item.name}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {moment
                            .utc(item.local_timestamp)
                            .format("DD-MM-YYYY HH:mm:ss")}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {parseFloat(item.lat).toFixed(5)}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {parseFloat(item.lon).toFixed(5)}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {item.speed}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {analog(
                            item.max_fuel_voltage,
                            item.max_fuel,
                            item.analog,
                            item.max_empty_voltage
                          )}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {item.Temp1}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {item.Temp2}
                        </td>
                        <td className=" w-1/5 sticky text-sm border">
                          {item.distance === null
                            ? preDistance(vehicleReportData, i)
                            : parseFloat(item.distance).toFixed(3)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TempReport;
