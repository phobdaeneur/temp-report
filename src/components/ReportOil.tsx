import React, { useContext, useState, useEffect } from "react";
import { ISelect } from "../views/Home";
import axios, { AxiosRequestConfig } from "axios";
import { StoreContext } from "../store";
import useSWR from "swr";
import Select, { SingleValue } from "react-select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import moment from "moment";

export interface IVehicle {
  fleet_id: number;
  veh_id: number;
  registration: string;
}

export interface IVehicleOn {
  event: string;
  local_timestamp: string;
  distance: string;
  oil_off: string;
  time_off: string;
  distance_off: string;
  resetEvent: string;
}

export interface IVehicleSelect {
  label: string;
  value: string;
}

export interface IVehicleTypeSelect {
  vehTypeId: number;
  value: string;
  veh_type: string;
}

export interface IVehicleOnToOff {
  local_timestamp: string;
  idx: string;
  oil: string;
}

export interface IVehicleFToL {
  time: string;
  oil: string;
  distance: string;
}

export interface IDataOil {
  local_timestamp: string;
  maxOil: string;
  distance: string;
  time_off: string;
  oil_off: string;
  distance_off: string;
}

interface IOil {
  dis1: string;
  dis2: string;
  dis3: string;
  oil1: string;
  oil2: string;
  oil3: string;
  registration: string;
  timeEnd1: string;
  timeEnd2: string;
  timeEnd3: string;
  timeStart1: string;
  timeStart2: string;
  timeStart3: string;
  average: number;
  veh_type: string;
  veh_type_value: string;
  totleDis: string;
  totleOil: string;
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

function ReportOil({ selectFleet }: Props) {
  const { user } = useContext(StoreContext);
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  //Radio button
  const [selected, setSelected] = useState("yes");
  const handleChange = (e: any) => {
    setSelected(e.target.value);
    setShouldFetch(false);
    setShouldFetchVeh(false);
  };
  //Radio button

  /**
   * Retrive Vehicles registration
   */
  const { data: vehicleData, error: vehicleError } = useSWR(
    [
      `http://localhost:5000/api/vehicle/registration/${selectFleet?.value}`,
      config,
    ],
    fetcher
  );
  // Select dropdown vehicle
  const [selectVehicle, setSelectVehicle] = useState<IVehicleSelect | null>(
    null
  );

  const handleselectVehicle = (newVehicle: SingleValue<IVehicleSelect>) => {
    setSelectVehicle(newVehicle);
  };

  // Vehicle data in dropdown
  const optionVehicle = vehicleData
    ? vehicleData.map((item: IVehicle, i: number) => {
        return { value: item.veh_id, label: item.registration };
      })
    : undefined;

  // Select dropdown vehicle
  const { data: vehicleTypeData, error: vehicleTypeError } = useSWR(
    [`http://localhost:5000/api/vehicleLog/oilVehicleType`, config],
    fetcher
  );
  // Select dropdown vehicle

  // Vehicle type data in dropdown
  const optionVehicleType = vehicleTypeData
    ? vehicleTypeData.map((item: IVehicleTypeSelect, i: number) => {
        return { value: item.vehTypeId, label: item.veh_type };
      })
    : undefined;
  const [selectVehicleType, setSelectVehicleType] = useState("0");
  console.log(optionVehicleType);
  const handleselectVehicleType = (e: any) => {
    setSelectVehicleType(e.target.value);
  };

  // Date start
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const handleDateStartChange = (newDateStart: Date | null) => {
    setDateStart(newDateStart);
    setShouldFetch(false);
    setShouldFetchVeh(false);
  };
  // Convert date start
  const dateStartChange = moment(dateStart).format("YYYY-MM-DD HH:mm:ss");
  // Date End
  var dateEnd = new Date(dateStart ? dateStart : 0);
  dateEnd.setHours(dateEnd.getHours() + 24);
  // Convert date end
  const dateEndChange = moment(dateEnd).format("YYYY-MM-DD HH:mm:ss");

  const [shouldFetch, setShouldFetch] = React.useState(false);
  function handleSearchReportByFleet() {
    setShouldFetch(true);
  }
  const { data: oilReportByFleet, error: oilReportByFleetError } = useSWR(
    [
      shouldFetch
        ? `https://geotrackerbackend.kratostracking.com:5000/api/vehicle/registration/${selectFleet?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );

  const [setting, setSetting] = useState("false");
  // console.log(oilReportByFleet);
  const display2 = oilReportByFleet
    ? oilReportByFleet.map(() => {
        var arrOil = [];
        if (oilReportByFleet == undefined || null) {
          return;
        } else {
          for (let i = 0; i < oilReportByFleet.length; i++) {
            var arr2 = [];
            if (oilReportByFleet[i].length == 1) {
              arrOil.push({
                disEnd: oilReportByFleet[i][0].disEnd,
                disStart: oilReportByFleet[i][0].disStart,
                distance: oilReportByFleet[i][0].distance,
                distance_off: oilReportByFleet[i][0].distance_off,
                local_timestamp: oilReportByFleet[i][0].local_timestamp,
                maxOil: oilReportByFleet[i][0].maxOil,
                oilEnd: oilReportByFleet[i][0].oilEnd,
                oilStart: oilReportByFleet[i][0].oilStart,
                oil_off: oilReportByFleet[i][0].oil_off,
                registration: oilReportByFleet[i][0].registration,
                timeEnd: oilReportByFleet[i][0].timeEnd,
                timeStart: oilReportByFleet[i][0].timeStart,
                time_off: oilReportByFleet[i][0].time_off,
                veh_id: oilReportByFleet[i][0].veh_id,
                veh_type: oilReportByFleet[i][0].veh_type,
                veh_type_value: oilReportByFleet[i][0].veh_type_value,
              });
            } else {
              for (let j = 0; j < oilReportByFleet[i].length; j++) {
                var arr = [];
                if (oilReportByFleet[i][j].local_timestamp == 0) {
                  arr.push({
                    disEnd: oilReportByFleet[i][j].disEnd,
                    disStart: oilReportByFleet[i][j].disStart,
                    distance: oilReportByFleet[i][j].distance,
                    distance_off: oilReportByFleet[i][j].distance_off,
                    local_timestamp: oilReportByFleet[i][j].local_timestamp,
                    maxOil: oilReportByFleet[i][j].maxOil,
                    oilEnd: oilReportByFleet[i][j].oilEnd,
                    oilStart: oilReportByFleet[i][j].oilStart,
                    oil_off: oilReportByFleet[i][j].oil_off,
                    registration: oilReportByFleet[i][j].registration,
                    timeEnd: oilReportByFleet[i][j].timeEnd,
                    timeStart: oilReportByFleet[i][j].timeStart,
                    time_off: oilReportByFleet[i][j].time_off,
                    veh_id: oilReportByFleet[i][j].veh_id,
                    veh_type: oilReportByFleet[i][j].veh_type,
                    veh_type_value: oilReportByFleet[i][j].veh_type_value,
                  });
                } else {
                  arr2.push({
                    disEnd: oilReportByFleet[i][j].disEnd,
                    disStart: oilReportByFleet[i][j].disStart,
                    distance: oilReportByFleet[i][j].distance,
                    distance_off: oilReportByFleet[i][j].distance_off,
                    local_timestamp: oilReportByFleet[i][j].local_timestamp,
                    maxOil: oilReportByFleet[i][j].maxOil,
                    oilEnd: oilReportByFleet[i][j].oilEnd,
                    oilStart: oilReportByFleet[i][j].oilStart,
                    oil_off: oilReportByFleet[i][j].oil_off,
                    registration: oilReportByFleet[i][j].registration,
                    timeEnd: oilReportByFleet[i][j].timeEnd,
                    timeStart: oilReportByFleet[i][j].timeStart,
                    time_off: oilReportByFleet[i][j].time_off,
                    veh_id: oilReportByFleet[i][j].veh_id,
                    veh_type: oilReportByFleet[i][j].veh_type,
                    veh_type_value: oilReportByFleet[i][j].veh_type_value,
                  });
                }
              }
              arr2.push(arr ? arr[0] : undefined);
              arrOil.push(arr2);
            }
            // arrOil.push(arr[0]);
          }
        }
        return arrOil;
      })
    : undefined;

  // console.log(display2);
  const tableReport2 = display2 ? display2[0] : undefined;
  // console.log(tableReport2);

  const display = tableReport2
    ? tableReport2.map(() => {
        var arr = [];
        if (tableReport2 == undefined || null) {
          return;
        } else {
          for (let i = 0; i < tableReport2.length; i++) {
            if (tableReport2[i].length == undefined) {
              arr.push({
                registration: tableReport2[i].registration,
                timeStart1: "-",
                timeEnd1: "-",
                dis1: "-",
                oil1: "-",
                timeStart2: "-",
                timeEnd2: "-",
                dis2: "-",
                oil2: "-",
                timeStart3: "-",
                timeEnd3: "-",
                dis3: "-",
                oil3: "-",
                average: 1,
                veh_type: tableReport2[i].veh_type,
                veh_type_value: tableReport2[i].veh_type_value,
                totleDis: "-",
                totleOil: "-",
              });
            }
            if (
              tableReport2[i].length == 1 &&
              tableReport2[i][0] != undefined
            ) {
              arr.push({
                registration: tableReport2[i][0].registration,
                timeStart1: tableReport2[i][0].timeStart,
                timeEnd1: tableReport2[i][0].timeEnd,
                dis1: (
                  tableReport2[i][0].disEnd - tableReport2[i][0].disStart
                ).toFixed(3),
                oil1: tableReport2[i][0].oilStart - tableReport2[i][0].oilEnd,
                timeStart2: "-",
                timeEnd2: "-",
                dis2: "-",
                oil2: "-",
                timeStart3: "-",
                timeEnd3: "-",
                dis3: "-",
                oil3: "-",
                average: 2,
                veh_type: tableReport2[i][0].veh_type,
                veh_type_value: tableReport2[i][0].veh_type_value,
                totleDis: (
                  tableReport2[i][0].disEnd - tableReport2[i][0].disStart
                ).toFixed(3),
                totleOil:
                  tableReport2[i][0].oilStart - tableReport2[i][0].oilEnd,
              });
            }
            if (tableReport2[i].length == 2) {
              arr.push({
                registration: tableReport2[i][0].registration,
                timeStart1: tableReport2[i][0].timeStart,
                timeEnd1: tableReport2[i][0].time_off,
                dis1: (
                  tableReport2[i][0].distance_off - tableReport2[i][0].disStart
                ).toFixed(3),
                oil1: tableReport2[i][0].oilStart - tableReport2[i][0].oil_off,
                timeStart2: tableReport2[i][0].local_timestamp,
                timeEnd2: tableReport2[i][0].timeEnd,
                dis2: (
                  tableReport2[i][0].disEnd - tableReport2[i][0].distance
                ).toFixed(3),
                oil2: tableReport2[i][0].maxOil - tableReport2[i][0].oilEnd,
                timeStart3: "-",
                timeEnd3: "-",
                dis3: "-",
                oil3: "-",
                average: 2,
                veh_type: tableReport2[i][0].veh_type,
                veh_type_value: tableReport2[i][0].veh_type_value,
                totleDis:
                  tableReport2[i][0].distance_off -
                  tableReport2[i][0].disStart +
                  (tableReport2[i][0].disEnd - tableReport2[i][0].distance),
                totleOil:
                  tableReport2[i][0].oilStart -
                  tableReport2[i][0].oil_off +
                  (tableReport2[i][0].maxOil - tableReport2[i][0].oilEnd),
              });
            }
            if (tableReport2[i].length > 2) {
              arr.push({
                registration: tableReport2[i][0].registration,
                timeStart1: tableReport2[i][0].timeStart,
                timeEnd1: tableReport2[i][0].time_off,
                dis1: (
                  tableReport2[i][0].distance_off - tableReport2[i][0].disStart
                ).toFixed(3),
                oil1: tableReport2[i][0].oilStart - tableReport2[i][0].oil_off,

                timeStart2: tableReport2[i][0].local_timestamp,
                timeEnd2: tableReport2[i][1].time_off,
                dis2: (
                  tableReport2[i][1].distance_off - tableReport2[i][0].distance
                ).toFixed(3),
                oil2: tableReport2[i][0].maxOil - tableReport2[i][1].oil_off,
                timeStart3: tableReport2[i][1].local_timestamp,
                timeEnd3: tableReport2[i][0].timeEnd,
                dis3: (
                  tableReport2[i][1].disEnd - tableReport2[i][0].distance
                ).toFixed(3),
                oil3: tableReport2[i][1].maxOil - tableReport2[i][0].oilEnd,
                average: 3,
                veh_type: tableReport2[i][0].veh_type,
                veh_type_value: tableReport2[i][0].veh_type_value,
                totleDis:
                  tableReport2[i][0].distance_off -
                  tableReport2[i][0].disStart +
                  (tableReport2[i][1].distance_off -
                    tableReport2[i][0].distance) +
                  (tableReport2[i][1].disEnd - tableReport2[i][0].distance),
                totleOil:
                  tableReport2[i][0].oilStart -
                  tableReport2[i][0].oil_off +
                  (tableReport2[i][0].maxOil - tableReport2[i][1].oil_off) +
                  (tableReport2[i][1].maxOil - tableReport2[i][0].oilEnd),
              });
            }
          }
        }
        return arr;
      })
    : undefined;
  const tableReport = display ? display[0] : undefined;
  // console.log(display);
  console.log(tableReport);

  const [valueOil, setValueOil] = useState<string>();
  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOil(event.target.value);
  };

  const [shouldFetchVeh, setShouldFetchVeh] = React.useState(false);
  function handleSearchReportByVeh() {
    setShouldFetchVeh(true);
  }
  const { data: oilReportByVeh, error: oilReportByVehError } = useSWR(
    [
      shouldFetchVeh
        ? `https://geotrackerbackend.kratostracking.com:5000/api/vehicle/oilreportByVehicle/${selectVehicle?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );

  const displayVeh = oilReportByVeh
    ? oilReportByVeh.map(() => {
        var arr = [];
        if (oilReportByVeh == undefined || null) {
          return;
        } else {
          if (oilReportByVeh.length == 1) {
            arr.push({
              // registration: oilReportByFleet[i].registration,
              timeStart1: oilReportByVeh[0].timeStart,
              timeEnd1: oilReportByVeh[0].time_off,
              dis1: (
                oilReportByVeh[0].distance_off - oilReportByVeh[0].disStart
              ).toFixed(3),
              oil1: oilReportByVeh[0].oilStart - oilReportByVeh[0].oil_off,
              timeStart2: oilReportByVeh[0].local_timestamp,
              timeEnd2: oilReportByVeh[0].timeEnd,
              dis2: (
                oilReportByVeh[0].disEnd - oilReportByVeh[0].distance
              ).toFixed(3),
              oil2: oilReportByVeh[0].maxOil - oilReportByVeh[0].oilEnd,
              timeStart3: "-",
              timeEnd3: "-",
              dis3: "-",
              oil3: "-",
              average: 2,
            });
          }
          if (oilReportByVeh.length > 1) {
            arr.push({
              // registration: oilReportByFleet[i][0].registration,
              timeStart1: oilReportByFleet[0].timeStart,
              timeEnd1: oilReportByFleet[0].time_off,
              dis1: (
                oilReportByFleet[0].distance_off - oilReportByFleet[0].disStart
              ).toFixed(3),
              oil1: oilReportByFleet[0].oilStart - oilReportByFleet[0].oil_off,

              timeStart2: oilReportByFleet[0].local_timestamp,
              timeEnd2: oilReportByFleet[1].time_off,
              dis2: (
                oilReportByFleet[1].distance_off - oilReportByFleet[0].distance
              ).toFixed(3),
              oil2: oilReportByFleet[0].maxOil - oilReportByFleet[1].oil_off,
              timeStart3: oilReportByFleet[1].local_timestamp,
              timeEnd3: oilReportByFleet[0].timeEnd,
              dis3: (
                oilReportByFleet[1].disEnd - oilReportByFleet[0].distance
              ).toFixed(3),
              oil3: oilReportByFleet[1].maxOil - oilReportByFleet[0].oilEnd,
              average: 3,
            });
          }
        }
        return arr;
      })
    : undefined;
  const tableReportVeh = displayVeh ? displayVeh[0] : undefined;

  return (
    <div className="flex flex-col dark:bg-[#000000] gap-10 justify-center items-center">
      <div className="flex flex-col sticky z-10 w-full px-5 dark:bg-[#000000] bg-white">
        <div className="flex flex-col gap-4 items-center justify-center pt-14">
          {/* Redio button */}
          <div className="flex flex-row gap-32 items-center justify-center">
            <div className="flex flex-row gap-4">
              <input
                type="radio"
                id="yes"
                name="choose"
                value="yes"
                checked={selected === "yes"}
                onChange={handleChange}
              />
              <label className="dark:text-white font-mono" htmlFor="yes">
                All vehicles
              </label>
            </div>

            <div className="flex flex-row gap-4 items-center justify-center">
              <input
                type="radio"
                id="no"
                name="choose"
                value="no"
                onChange={handleChange}
                checked={selected === "no"}
              />
              <label className="dark:text-white font-mono" htmlFor="no">
                Select vehicle
              </label>

              {selected == "no" ? (
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
              ) : null}
            </div>
          </div>

          <div className="flex flex-row gap-7 items-center justify-center">
            {/* Date start */}
            <div className=" flex flex-row gap-5 items-center justify-center dark:bg-white pt-3 px-1 pb-1 rounded-md">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="เวลาเริ่มต้น"
                  ampm={false}
                  value={dateStart}
                  onChange={handleDateStartChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <div className=" flex flex-row gap-5 items-center justify-center dark:bg-white pt-3 px-1 pb-1 rounded-md">
              <TextField
                label="ราคาน้ำมัน"
                type="number"
                value={valueOil}
                onChange={handleChangeValue}
              />
            </div>
            {/* Date start */}

            {/* Button search */}
            {selected == "no" ? (
              <>
                <button
                  className=" w-96 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
                  disabled={shouldFetch}
                  onClick={() => {
                    handleSearchReportByVeh();
                    // setIndexTime(indexTime + 1);
                  }}
                >
                  <span className="mx-auto">ค้นหาโดยยานยนต์</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className=" w-60 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
                  //disabled={shouldFetch}
                  onClick={handleSearchReportByFleet}
                >
                  <span className="mx-auto">ค้นหา</span>
                </button>
                <button
                  className=" w-60 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#53a6d3] hover:border-[#4b98c2] hover:bg-[#53a6d3] hover:text-white shadow-md shadow-[#53a6d3] dark:shadow-[#53a6d3] py-2 px-6 inline-flex items-center justify-center"
                  //disabled={shouldFetch}
                  onClick={() => {
                    setSetting("true");
                  }}
                >
                  <span className="mx-auto">ตั้งค่าประเภทยานยนต์</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Setting vehicle type */}
      {setting === "true" ? (
        <div className="flex flex-col items-center justify-center gap-5 pb-10">
          <div className=" grid grid-cols-4 items-center justify-center gap-3">
            {tableReport
              ? tableReport.map((item: IOil) => (
                  <div className="flex flex-row items-center justify-between w-60 xl:w-80 border rounded-lg py-3 px-5">
                    <label>{item.registration}</label>
                    <select
                      name="vehType"
                      id="vehType"
                      className="font-mono text-xs text-center text-black dark:bg-[#000000] dark:text-white"
                      // value={selectVehicleType}
                      // onChange={handleselectVehicleType}
                    >
                      {item.veh_type.toString() === "0" ? (
                        <option hidden disabled selected value="0">
                          เลือกประเภทของยานยนต์
                        </option>
                      ) : (
                        <option value={item.veh_type_value}>
                          {item.veh_type}
                        </option>
                      )}
                      {optionVehicleType
                        ? optionVehicleType.map((items: IVehicleSelect) => (
                            <option value={items.value}>{items.label}</option>
                          ))
                        : undefined}
                    </select>
                  </div>
                ))
              : null}
          </div>
          <button
            className=" w-60 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#c88334] hover:border-[#a0692a] hover:bg-[#c88334] hover:text-white shadow-md shadow-[#c88334] dark:shadow-[#c88334] py-2 px-6 inline-flex items-center justify-center"
            //disabled={shouldFetch}
            onClick={() => {
              setSetting("false");
            }}
          >
            <span className="mx-auto">บันทึก</span>
          </button>
        </div>
      ) : (
        <>
          {/* Display report*/}
          {selected === "yes" ? (
            <section className="container mx-auto font-mono">
              <label className="text-xl dark:text-white flex items-center justify-center pb-3">
                Oil report all vehicles
              </label>
              <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full h-96 overflow-x-auto overflow-y-auto relative">
                  {tableReport == undefined || null ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <label className="text-xl dark:text-white">
                        โปรดระบุข้อมูลให้ครบถ้วนเเล้วกดปุ่มค้นหา
                      </label>
                      <label className="text-xl dark:text-white">
                        หรือไม่มียานยนต์ที่เติมน้ำมันในวันที่ท่านเลือกโปรดระบุวันเวลาเเละกดค้นหาใหม่อีกครั้ง
                      </label>
                    </div>
                  ) : (
                    <table className=" w-full table-auto table-striped relative ">
                      <thead>
                        <tr className="text-sm sticky top-0 font-mono tracking-wide whitespace-nowrap text-center text-black bg-gray-100 dark:bg-gray-600 uppercase border-gray-600">
                          <th className=" px-2 py-2 ">ลำดับ </th>
                          <th className=" px-2 py-2 ">ทะเบียนรถ </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className="px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className=" px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className=" px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2 ">
                            อัตรา <br></br>สิ้นเปลืองเฉลี่ย
                          </th>
                          <th className=" px-2 py-2 bg-orange-200">
                            ประเภทยานยนต์{" "}
                          </th>
                          <th className=" px-2 py-2 bg-blue-100">
                            ราคาน้ำมัน{" "}
                          </th>
                          <th className=" px-2 py-2 bg-yellow-100">
                            บริษัทกำหนด <br></br>(กม. / ลิตร){" "}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableReport
                          ? tableReport.map((item: IOil, i: number) => (
                              <tr className="text-gray-700 text-center dark:text-white ">
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {i + 1}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.registration}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeStart1 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeStart1)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeEnd1 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeEnd1)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.dis1}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil1 == "-" ? "-" : item.oil1}
                                </td>
                                <td className="px-2 py-2 text-xs border  border-r-2 border-r-black dark:border-r-white dark:border-gray-600 ">
                                  {item.oil1 == "-"
                                    ? "-"
                                    : isNaN(
                                        parseFloat(item.dis1) /
                                          parseInt(item.oil1)
                                      )
                                    ? "0.000"
                                    : (
                                        parseFloat(item.dis1) /
                                        parseInt(item.oil1)
                                      ).toFixed(3)}
                                </td>

                                {/* section 2 */}
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeStart2 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeStart2)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeEnd2 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeEnd2)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.dis2 == "-" ? "-" : item.dis2}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil2}
                                </td>
                                <td className="px-2 py-2 text-xs border border-r-2 border-r-black dark:border-r-white dark:border-gray-600 ">
                                  {item.oil2.toString() == "-"
                                    ? "-"
                                    : (
                                        parseFloat(item.dis2) /
                                        parseInt(item.oil2)
                                      ).toFixed(3)}
                                </td>

                                {/* section 3 */}
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeStart3 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeStart3)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.timeEnd3 == "-"
                                    ? "-"
                                    : moment
                                        .utc(item.timeEnd3)
                                        .format("DD-MM-YYYY HH:mm:ss")}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.dis3}
                                </td>
                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil3}
                                </td>
                                <td className="px-2 py-2 text-xs border border-r-2 border-r-black dark:border-r-white dark:border-gray-600 ">
                                  {isNaN(
                                    parseFloat(item.dis3) / parseInt(item.oil3)
                                  )
                                    ? "-"
                                    : (
                                        parseFloat(item.dis3) /
                                        parseInt(item.oil3)
                                      ).toFixed(3)}
                                </td>

                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil1 == "-" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil2 == "-" ? (
                                        isNaN(
                                          parseInt(item.dis1) /
                                            parseInt(item.oil1)
                                        ) ? (
                                          "0.000"
                                        ) : (
                                          (
                                            parseInt(item.dis1) /
                                            parseInt(item.oil1)
                                          ).toFixed(3)
                                        )
                                      ) : (
                                        <>
                                          {item.oil3 == "-"
                                            ? (
                                                (isNaN(
                                                  parseInt(item.dis1) /
                                                    parseInt(item.oil1)
                                                )
                                                  ? 0 +
                                                    parseInt(item.dis2) /
                                                      parseInt(item.oil2)
                                                  : parseInt(item.dis1) /
                                                      parseInt(item.oil1) +
                                                    parseInt(item.dis2) /
                                                      parseInt(item.oil2)) /
                                                item.average
                                              ).toFixed(3)
                                            : (
                                                (isNaN(
                                                  parseInt(item.dis1) /
                                                    parseInt(item.oil1)
                                                )
                                                  ? 0 +
                                                    parseInt(item.dis2) /
                                                      parseInt(item.oil2) +
                                                    parseInt(item.dis3) /
                                                      parseInt(item.oil3)
                                                  : parseInt(item.dis1) /
                                                      parseInt(item.oil1) +
                                                    parseInt(item.dis2) /
                                                      parseInt(item.oil2) +
                                                    parseInt(item.dis3) /
                                                      parseInt(item.oil3)) /
                                                item.average
                                              ).toFixed(3)}
                                        </>
                                      )}
                                    </>
                                  )}
                                </td>

                                <td className=" text-sm border dark:border-gray-600 ">
                                  {item.veh_type.toString() === "0"
                                    ? "โปรดระบุประเภทของยานยนต์"
                                    : item.veh_type}
                                </td>
                                <td className="text-sm border dark:border-gray-600 ">
                                  {valueOil}
                                </td>

                                {/* function บริษัทกำหนด */}
                                <>
                                  {item.oil1 == "-" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {(
                                        (parseFloat(item.totleDis) /
                                          parseFloat(item.veh_type_value) -
                                          parseInt(item.totleOil)) *
                                        parseFloat(valueOil ? valueOil : "0")
                                      )
                                        .toString()
                                        .substring(1, 0) == "-" ? (
                                        <td className="text-red-500 text-sm border dark:border-gray-600">
                                          {(
                                            (parseFloat(item.totleDis) /
                                              parseFloat(item.veh_type_value) -
                                              parseInt(item.totleOil)) *
                                            parseFloat(
                                              valueOil ? valueOil : "0"
                                            )
                                          ).toFixed(3)}
                                        </td>
                                      ) : (
                                        <td className="text-sm border dark:border-gray-600">
                                          {(
                                            (parseFloat(item.totleDis) /
                                              parseFloat(item.veh_type_value) -
                                              parseInt(item.totleOil)) *
                                            parseFloat(
                                              valueOil ? valueOil : "0"
                                            )
                                          ).toFixed(3)}
                                        </td>
                                      )}
                                    </>
                                  )}
                                </>
                              </tr>
                            ))
                          : undefined}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="container mx-auto font-mono">
              <label className="text-xl dark:text-white flex items-center justify-center pb-3">
                Oil report select vehicle
              </label>
              <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto ">
                  {tableReportVeh == undefined || null ? (
                    <div>
                      {selectVehicle == undefined || null ? (
                        <label className="text-2xl dark:text-white flex items-center justify-center">
                          โปรดระบุข้อมูลให้ครบถ้วนเเล้วกดปุ่มค้นหา
                        </label>
                      ) : (
                        <label className="text-2xl dark:text-white flex items-center justify-center">
                          {" "}
                          {selectVehicle?.label}{" "}
                          ไม่ได้เติมน้ำมันในวันที่ท่านเลือกโปรดระบุวันเวลาเเละกดค้นหาใหม่อีกครั้ง
                        </label>
                      )}
                    </div>
                  ) : (
                    <table className="  w-full">
                      <thead>
                        <tr className="text-sm font-mono tracking-wide whitespace-nowrap text-center text-black bg-gray-100 dark:bg-gray-600 uppercase border-gray-600">
                          <th className=" px-2 py-2 border-r ">ลำดับ </th>
                          <th className=" px-2 py-2 border-r">ทะเบียนรถ </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className="px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className=" px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2">เวลาเริ่มต้น </th>
                          <th className=" px-2 py-2">เวลาสิ้นสุด </th>
                          <th className=" px-2 py-2">
                            ระยะทาง <br></br>(กม.)
                          </th>
                          <th className=" px-2 py-2">
                            น้ำมัน <br></br>(ลิตร)
                          </th>
                          <th className=" px-2 py-2  border-r-2 border-r-black dark:border-r-white">
                            อัตราสิ้นเปลือง <br></br>(กม. / ลิตร)
                          </th>

                          <th className=" px-2 py-2 ">
                            อัตรา <br></br>สิ้นเปลืองเฉลี่ย
                          </th>
                          <th className=" px-2 py-2 bg-orange-200">
                            ประเภทยานยนต์{" "}
                          </th>
                          <th className=" px-2 py-2 bg-blue-100">
                            ราคาน้ำมัน{" "}
                          </th>
                          <th className=" px-2 py-2 bg-yellow-100">
                            บริษัทกำหนด <br></br>(กม. / ลิตร){" "}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableReportVeh ? (
                          tableReportVeh.map((item: IOil, i: number) => (
                            <tr className="text-gray-700 text-center dark:text-white">
                              <td className="px-2 py-2 text-xs border">
                                {i + 1}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {selectVehicle?.label}
                              </td>
                              <td className="px-2 py-2 text-xs border ">
                                {moment
                                  .utc(item.timeStart1)
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {moment
                                  .utc(item.timeEnd1)
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.dis1}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.oil1}
                              </td>
                              <td className="px-2 py-2 text-xs border  border-r-2 border-r-black dark:border-r-white">
                                {isNaN(
                                  parseInt(item.dis1) / parseInt(item.oil1)
                                )
                                  ? "0.000"
                                  : (
                                      parseInt(item.dis1) / parseInt(item.oil1)
                                    ).toFixed(3)}
                              </td>

                              {/* section 2 */}
                              <td className="px-2 py-2 text-xs border">
                                {moment
                                  .utc(item.timeStart2)
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {moment
                                  .utc(item.timeEnd2)
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.dis2}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.oil2}
                              </td>
                              <td className="px-2 py-2 text-xs border border-r-2 border-r-black dark:border-r-white">
                                {(
                                  parseInt(item.dis2) / parseInt(item.oil2)
                                ).toFixed(3)}
                              </td>

                              {/* section 3 */}
                              <td className="px-2 py-2 text-xs border">
                                {item.timeStart3 == "-"
                                  ? "-"
                                  : moment
                                      .utc(item.timeStart3)
                                      .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.timeStart3 == "-"
                                  ? "-"
                                  : moment
                                      .utc(item.timeEnd3)
                                      .format("DD-MM-YYYY HH:mm:ss")}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.dis3}
                              </td>
                              <td className="px-2 py-2 text-xs border">
                                {item.oil3}
                              </td>
                              <td className="px-2 py-2 text-xs border border-r-2 border-r-black dark:border-r-white">
                                {isNaN(
                                  parseInt(item.dis3) / parseInt(item.oil3)
                                )
                                  ? "-"
                                  : (
                                      parseInt(item.dis3) / parseInt(item.oil3)
                                    ).toFixed(3)}
                              </td>

                              <td className="px-2 py-2 text-xs border">
                                {item.oil3 == "-"
                                  ? (
                                      (isNaN(
                                        parseInt(item.dis1) /
                                          parseInt(item.oil1)
                                      )
                                        ? 0 +
                                          parseInt(item.dis2) /
                                            parseInt(item.oil2)
                                        : parseInt(item.dis1) /
                                            parseInt(item.oil1) +
                                          parseInt(item.dis2) /
                                            parseInt(item.oil2)) / item.average
                                    ).toFixed(3)
                                  : (
                                      (isNaN(
                                        parseInt(item.dis1) /
                                          parseInt(item.oil1)
                                      )
                                        ? 0 +
                                          parseInt(item.dis2) /
                                            parseInt(item.oil2) +
                                          parseInt(item.dis3) /
                                            parseInt(item.oil3)
                                        : parseInt(item.dis1) /
                                            parseInt(item.oil1) +
                                          parseInt(item.dis2) /
                                            parseInt(item.oil2) +
                                          parseInt(item.dis3) /
                                            parseInt(item.oil3)) / item.average
                                    ).toFixed(3)}
                              </td>

                              <td className=" sticky text-sm border">
                                <select
                                  name="vehType"
                                  id="vehType"
                                  className="font-mono text-xs text-center text-black dark:bg-[#000000] dark:text-white"
                                  // value={selectVehicleType}
                                  onChange={handleselectVehicleType}
                                >
                                  <option hidden disabled selected value="0">
                                    เลือกประเภทของยานยนต์
                                  </option>
                                  {optionVehicleType
                                    ? optionVehicleType.map(
                                        (items: IVehicleSelect) => (
                                          <option value={items.value}>
                                            {items.label}
                                          </option>
                                        )
                                      )
                                    : undefined}
                                </select>
                              </td>
                              <td className="sticky text-sm border">
                                {valueOil}
                              </td>
                              <td className="sticky text-sm border">
                                {selectVehicleType
                                  ? selectVehicleType
                                  : undefined}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-2 py-2 text-xl border">No!!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default ReportOil;
