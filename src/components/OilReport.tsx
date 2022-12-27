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
import { oilsensor } from "../utils/oil";
import { Item } from "devextreme-react/action-sheet";

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

function OilReport({ selectFleet }: Props) {
  const { user } = useContext(StoreContext);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

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

  //Radio button
  const [selected, setSelected] = useState("yes");
  const handleChange = (e: any) => {
    console.log(e.target.value);
    setSelected(e.target.value);
  };
  //Radio button

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
  //console.log(optionVehicle);

  // Date start
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const handleDateStartChange = (newDateStart: Date | null) => {
    setDateStart(newDateStart);
  };
  // Convert date start
  const dateStartChange = moment(dateStart).format("YYYY-MM-DD HH:mm:ss");

  // Date End
  var dateEnd = new Date(dateStart ? dateStart : 0);
  dateEnd.setHours(dateEnd.getHours() + 24);
  // console.log("Date end" + dateEnd);
  // Convert date end
  const dateEndChange = moment(dateEnd).format("YYYY-MM-DD HH:mm:ss");

  /**
   * Retrive Vehicles EngineOn Data
   */
  const [shouldFetch, setShouldFetch] = React.useState(false);
  function handleSearchReport() {
    setShouldFetch(true);
  }
  const { data: vehicleEngineOnData, error: vehicleEngineOnError } = useSWR(
    [
      shouldFetch
        ? `http://localhost:5000/api/vehicleLog/logMSG/${selectVehicle?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );

  const time_on = vehicleEngineOnData
    ? vehicleEngineOnData.map((item: IVehicleOn, i: number) => {
        if (item.resetEvent == "0") {
          return item.local_timestamp;
        } else {
          return;
        }
      })
    : null;

  const { data: vehicleDataFirstAndLastRow, error: vehicleFirstAndLastRow } =
    useSWR(
      [
        `http://localhost:5000/api/vehicleLog/firstAndLastRow/${selectVehicle?.value}/${dateStartChange}/${dateEndChange}`,
        config,
      ],
      fetcher
    );

  const [indexTime, setIndexTime] = useState(0);
  const [shouldFetchOff, setShouldFetchOff] = React.useState(true);
  const { data: vehicleDataOntoOff, error: vehicleOnToOffError } = useSWR(
    [
      shouldFetchOff
        ? `http://localhost:5000/api/vehicleLog/timeEngineOff/${
            selectVehicle?.value
          }/${time_on ? time_on[indexTime] : null}`
        : undefined,
      config,
      //setIndexTime(indexTime + 1),
    ],
    fetcher
  );

  console.log(vehicleDataOntoOff);
  console.log(vehicleEngineOnData);
  console.log(indexTime);

  let dt: any[] = [];
  // let promises = [];
  // const test = () =>
  //   vehicleEngineOnData
  //     ? vehicleEngineOnData.map((item: IVehicleOn, i: number) => {
  //         for (let i = 0; i < vehicleEngineOnData.length; i++) {
  //           if (item.resetEvent == "0") {
  //             axios
  //               .get("http://localhost:5000/api/vehicleLog/timeEngineOff", {
  //                 params: {
  //                   vehicleId: selectVehicle?.value,
  //                   dateStart: item.local_timestamp[i],
  //                 },
  //               })
  //               .then((response) => {
  //                 console.log(response);
  //                 vehicleDataOntoOff.push(response);
  //               })
  //               .catch(function (error) {
  //                 console.log(error);
  //               });
  //           }
  //         }
  //       })
  //     : null;
  const test = vehicleEngineOnData
    ? vehicleEngineOnData.map((item: IVehicleOn, i: number) => {
        if (item.resetEvent == "0") {
          dt.push(
            oilsensor(vehicleDataOntoOff, vehicleEngineOnData[indexTime])
          );
        } else {
          return;
        }
      })
    : undefined;

  console.log(dt);
  const dtOil: any[] = [];
  const test2 = dt
    ? dt.map((item: IVehicleOn) => {
        if (dt[0] === undefined || dt[0] === null) {
          return;
        } else {
          dtOil.push(dt[0]);
        }
      })
    : undefined;

  console.log(dtOil);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (indexTime < vehicleEngineOnData ? vehicleEngineOnData.length : null) {
  //       setIndexTime(indexTime + 1);
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  const display = () => {
    const oilFirst: number = parseInt(
      vehicleDataFirstAndLastRow
        ? vehicleDataFirstAndLastRow[0]!.oil.toString()
        : "0"
    );
    const oillast: number = parseInt(
      vehicleDataFirstAndLastRow
        ? vehicleDataFirstAndLastRow[1]!.oil.toString()
        : "0"
    );
    const disFirst: number = parseFloat(
      vehicleDataFirstAndLastRow
        ? vehicleDataFirstAndLastRow[0]!.distance.toString()
        : "0"
    );
    const dislast: number = parseFloat(
      vehicleDataFirstAndLastRow
        ? vehicleDataFirstAndLastRow[1]!.distance.toString()
        : "0"
    );
    if (dtOil[0]?.length < 2) {
      return (
        <>
          <tr className="text-gray-700 flex w-full">
            <td className=" w-1/5 sticky text-sm border">
              {selectVehicle?.label}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {vehicleDataFirstAndLastRow[0]?.timeOff}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {dt[0][0]?.time_off}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {(
                parseFloat(dtOil[0][0]?.distance_off.toString()) - disFirst
              ).toFixed(3)}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {oilFirst - parseInt(dtOil[0][0]?.oil_off.toString())}
            </td>
          </tr>

          <tr className="text-gray-700 flex w-full">
            <td className=" w-1/5 sticky text-sm border">
              {selectVehicle?.label}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {dt[0][0]?.local_timestamp}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {vehicleDataFirstAndLastRow[1]?.timeOff}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {(dislast - parseFloat(dtOil[0][0]?.distance.toString())).toFixed(
                3
              )}
            </td>
            <td className=" w-1/5 sticky text-sm border">
              {parseInt(dtOil[0][0]?.maxOil.toString()) - oillast}
            </td>
          </tr>
        </>
      );
    }
  };
  return (
    <div className="flex flex-col dark:bg-black gap-10 justify-center items-center">
      <div className="flex flex-col sticky z-10 w-full px-5 dark:bg-black bg-white">
        <div className="flex flex-col gap-4 items-center justify-center pt-14">
          <label className=" text-lg font-mono dark:text-white">
            Oil report search
          </label>

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
            <div className="dark:bg-white dark:rounded-xl">
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
            {/* Date start */}

            {/* Button search */}
            {selected == "no" ? (
              <>
                <button
                  className=" w-96 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
                  disabled={shouldFetch}
                  onClick={() => {
                    handleSearchReport();
                    setIndexTime(0);
                  }}
                >
                  <span className="mx-auto">ค้นหาโดยยานยนต์</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className=" w-96 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
                  //disabled={shouldFetch}
                  //onClick={handleSearchReport}
                >
                  <span className="mx-auto">ค้นหา</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Display report*/}
      <button
        className=" w-96 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
        //disabled={shouldFetch}
        onClick={() => {
          if (indexTime < vehicleEngineOnData.length - 1) {
            setIndexTime(indexTime + 1);
          } else {
            setIndexTime(0);
          }
        }}
      >
        <span className="mx-auto">Click!!!!</span>
      </button>

      <div className="w-full px-10">
        <table className="w-full font-mono text-center">
          <thead className=" text-md  text-gray-800 bg-[#B3BBA5] dark:bg-[#059669] w-full ">
            <tr className="flex items-center w-full">
              <th className=" w-1/5 ">ทะเบียนรถ </th>
              <th className=" w-1/5 ">เวลาเริ่มต้น </th>
              <th className=" w-1/5 ">เวลาสิ้นสุด </th>
              <th className=" w-1/5 ">
                ระยะทาง <br></br> {"(กิโลเมตร)"}
              </th>
              <th className=" w-1/5 ">
                น้ำมัน <br></br> {"(ลิตร)"}
              </th>
            </tr>
          </thead>
          <tbody>
            {!vehicleDataOntoOff ? (
              <tr className="text-gray-700 flex w-full">
                <td className=" w-1/5 sticky text-sm border">
                  {selectVehicle?.label}
                </td>
                <td className=" w-1/5 sticky text-sm border">-</td>
                <td className=" w-1/5 sticky text-sm border">-</td>
                <td className=" w-1/5 sticky text-sm border">-</td>
                <td className=" w-1/5 sticky text-sm border">-</td>
              </tr>
            ) : (
              display()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OilReport;
