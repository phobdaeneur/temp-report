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
import excelOilReportByFleet from "../utils/excelOilReportByFleet";
import excelOilReportByVeh from "../utils/excelOilReportByVeh";
import { generatePDFOilReportByFleet } from "../utils/pdfOilReportByFleet";
import { generatePDFOilReportByVeh } from "../utils/pdfOilReportByVeh";
import excel from "../images/excel.svg";
import pdf from "../images/pdf.svg";

export interface IVehicle {
  fleet_id: number;
  veh_id: number;
  registration: string;
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

export interface IOil {
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
  averageOil: string;
  veh_id: number;
}

interface IVehtype {
  veh_id: number;
  vehType_id: number;
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

  // Connect API from Vehicles registration
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

  // Connect API from vehicle type
  const { data: vehicleTypeData, error: vehicleTypeError } = useSWR(
    [`http://localhost:5000/api/vehicleLog/oilVehicleType`, config],
    fetcher
  );

  // Vehicle type data in dropdown
  const optionVehicleType = vehicleTypeData
    ? vehicleTypeData.map((item: IVehicleTypeSelect, i: number) => {
        return { value: item.vehTypeId, label: item.veh_type };
      })
    : undefined;

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
  dateEnd.setHours(dateEnd.getHours() + 24); // + 24 ชั่วโมง
  // Convert date end
  const dateEndChange = moment(dateEnd).format("YYYY-MM-DD HH:mm:ss");

  //Connect API from oil report all vehicle
  const [shouldFetch, setShouldFetch] = React.useState(false);
  function handleSearchReportByFleet() {
    setShouldFetch(true);
  }
  const { data: oilReportByFleet, error: oilReportByFleetError } = useSWR(
    [
      shouldFetch
        ? `http://localhost:5000/api/vehicle/registration/${selectFleet?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );
  //Connect API from oil report all vehicle

  const [setting, setSetting] = useState("false");
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
  const tableReport2 = display2 ? display2[0] : undefined;

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
                veh_id: tableReport2[i].veh_id,
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
                veh_id: tableReport2[i][0].veh_id,
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
                veh_id: tableReport2[i][0].veh_id,
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
                veh_id: tableReport2[i][0].veh_id,
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

  const [valueOil, setValueOil] = useState<string>(); //เก็บค่าราคาน้ำมันที่ผู้ใช้งานระบุ
  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOil(event.target.value);
  };

  //Connect API from oil report select vehicle
  const [shouldFetchVeh, setShouldFetchVeh] = React.useState(false);
  function handleSearchReportByVeh() {
    setShouldFetchVeh(true);
  }
  const { data: oilReportByVeh, error: oilReportByVehError } = useSWR(
    [
      shouldFetchVeh
        ? `http://localhost:5000/api/vehicle/oilreportByVehicle/${selectVehicle?.value}/${dateStartChange}/${dateEndChange}`
        : undefined,
      config,
    ],
    fetcher
  );
  //Connect API from oil report select vehicle

  const displayVeh2 = oilReportByVeh
    ? oilReportByVeh.map(() => {
        var arrOil = [];
        if (oilReportByVeh == undefined || null) {
          return;
        } else {
          var arr2 = [];
          var arr = [];
          for (let j = 0; j < oilReportByVeh.length; j++) {
            if (oilReportByVeh[j].local_timestamp == 0) {
              arr.push({
                disEnd: oilReportByVeh[j].disEnd,
                disStart: oilReportByVeh[j].disStart,
                distance: oilReportByVeh[j].distance,
                distance_off: oilReportByVeh[j].distance_off,
                local_timestamp: oilReportByVeh[j].local_timestamp,
                maxOil: oilReportByVeh[j].maxOil,
                oilEnd: oilReportByVeh[j].oilEnd,
                oilStart: oilReportByVeh[j].oilStart,
                oil_off: oilReportByVeh[j].oil_off,
                timeEnd: oilReportByVeh[j].timeEnd,
                timeStart: oilReportByVeh[j].timeStart,
                time_off: oilReportByVeh[j].time_off,
                veh_id: oilReportByVeh[j].veh_id,
                veh_type: oilReportByVeh[j].veh_type,
                veh_type_value: oilReportByVeh[j].veh_type_value,
              });
            } else {
              arr2.push({
                disEnd: oilReportByVeh[j].disEnd,
                disStart: oilReportByVeh[j].disStart,
                distance: oilReportByVeh[j].distance,
                distance_off: oilReportByVeh[j].distance_off,
                local_timestamp: oilReportByVeh[j].local_timestamp,
                maxOil: oilReportByVeh[j].maxOil,
                oilEnd: oilReportByVeh[j].oilEnd,
                oilStart: oilReportByVeh[j].oilStart,
                oil_off: oilReportByVeh[j].oil_off,
                timeEnd: oilReportByVeh[j].timeEnd,
                timeStart: oilReportByVeh[j].timeStart,
                time_off: oilReportByVeh[j].time_off,
                veh_id: oilReportByVeh[j].veh_id,
                veh_type: oilReportByVeh[j].veh_type,
                veh_type_value: oilReportByVeh[j].veh_type_value,
              });
            }
          }
          arr2.push(arr ? arr[0] : undefined);
          arrOil.push(arr2);
        }
        return arrOil;
      })
    : undefined;
  const tableReportVeh2 = displayVeh2 ? displayVeh2[0] : undefined;
  // console.log(tableReportVeh2);

  const displayVeh = tableReportVeh2
    ? tableReportVeh2.map(() => {
        var arr = [];
        if (tableReportVeh2 == undefined || null) {
          return;
        } else {
          if (tableReportVeh2[0].length == 1) {
            if (tableReportVeh2[0][0].timeStart == 0) {
              arr.push({
                registration: selectVehicle?.label,
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
                veh_type: tableReportVeh2[0][0].veh_type,
                veh_type_value: tableReportVeh2[0][0].veh_type_value,
                totleDis: "-",
                totleOil: "-",
              });
            } else {
              arr.push({
                registration: selectVehicle?.label,
                timeStart1: tableReportVeh2[0][0].timeStart,
                timeEnd1: tableReportVeh2[0][0].timeEnd,
                dis1: (
                  tableReportVeh2[0][0].disEnd - tableReportVeh2[0][0].disStart
                ).toFixed(3),
                oil1:
                  tableReportVeh2[0][0].oilStart - tableReportVeh2[0][0].oilEnd,
                timeStart2: "-",
                timeEnd2: "-",
                dis2: "-",
                oil2: "-",
                timeStart3: "-",
                timeEnd3: "-",
                dis3: "-",
                oil3: "-",
                average: 1,
                veh_type: tableReportVeh2[0][0].veh_type,
                veh_type_value: tableReportVeh2[0][0].veh_type_value,
                totleDis: (
                  tableReportVeh2[0][0].disEnd - tableReportVeh2[0][0].disStart
                ).toFixed(3),
                totleOil:
                  tableReportVeh2[0][0].oilStart - tableReportVeh2[0][0].oilEnd,
              });
            }
          }
          if (tableReportVeh2[0].length == 2) {
            arr.push({
              registration: selectVehicle?.label,
              timeStart1: tableReportVeh2[0][0].timeStart,
              timeEnd1: tableReportVeh2[0][0].time_off,
              dis1: (
                tableReportVeh2[0][0].distance_off -
                tableReportVeh2[0][0].disStart
              ).toFixed(3),
              oil1:
                tableReportVeh2[0][0].oilStart - tableReportVeh2[0][0].oil_off,
              timeStart2: tableReportVeh2[0][0].local_timestamp,
              timeEnd2: tableReportVeh2[0][0].timeEnd,
              dis2: (
                tableReportVeh2[0][0].disEnd - tableReportVeh2[0][0].distance
              ).toFixed(3),
              oil2: tableReportVeh2[0][0].maxOil - tableReportVeh2[0][0].oilEnd,
              timeStart3: "-",
              timeEnd3: "-",
              dis3: "-",
              oil3: "-",
              average: 2,
              veh_type: tableReportVeh2[0][0].veh_type,
              veh_type_value: tableReportVeh2[0][0].veh_type_value,
              totleDis:
                tableReportVeh2[0][0].distance_off -
                tableReportVeh2[0][0].disStart +
                (tableReportVeh2[0][0].disEnd - tableReportVeh2[0][0].distance),
              totleOil:
                tableReportVeh2[0][0].oilStart -
                tableReportVeh2[0][0].oil_off +
                (tableReportVeh2[0][0].maxOil - tableReportVeh2[0][0].oilEnd),
            });
          }
          if (tableReportVeh2[0].length > 2) {
            arr.push({
              registration: selectVehicle?.label,
              timeStart1: tableReportVeh2[0][0].timeStart,
              timeEnd1: tableReportVeh2[0][0].time_off,
              dis1: (
                tableReportVeh2[0][0].distance_off -
                tableReportVeh2[0][0].disStart
              ).toFixed(3),
              oil1:
                tableReportVeh2[0][0].oilStart - tableReportVeh2[0][0].oil_off,

              timeStart2: tableReportVeh2[0][0].local_timestamp,
              timeEnd2: tableReportVeh2[0][1].time_off,
              dis2: (
                tableReportVeh2[0][1].distance_off -
                tableReportVeh2[0][0].distance
              ).toFixed(3),
              oil2:
                tableReportVeh2[0][0].maxOil - tableReportVeh2[0][1].oil_off,
              timeStart3: tableReportVeh2[0][1].local_timestamp,
              timeEnd3: tableReportVeh2[0][0].timeEnd,
              dis3: (
                tableReportVeh2[0][1].disEnd - tableReportVeh2[0][0].distance
              ).toFixed(3),
              oil3: tableReportVeh2[0][1].maxOil - tableReportVeh2[0][0].oilEnd,
              average: 3,
              veh_type: tableReportVeh2[0][0].veh_type,
              veh_type_value: tableReportVeh2[0][0].veh_type_value,
              totleDis:
                tableReportVeh2[0][0].distance_off -
                tableReportVeh2[0][0].disStart +
                (tableReportVeh2[0][1].distance_off -
                  tableReportVeh2[0][0].distance) +
                (tableReportVeh2[0][1].disEnd - tableReportVeh2[0][0].distance),
              totleOil:
                tableReportVeh2[0][0].oilStart -
                tableReportVeh2[0][0].oil_off +
                (tableReportVeh2[0][0].maxOil - tableReportVeh2[0][1].oil_off) +
                (tableReportVeh2[0][1].maxOil - tableReportVeh2[0][0].oilEnd),
            });
          }
        }
        return arr;
      })
    : undefined;
  const tableReportVeh = displayVeh ? displayVeh[0] : undefined;
  // console.log(displayVeh);

  const dateTime = moment(dateStart).format("DD-MM-YYYY");
  const fileName = dateTime + " " + selectFleet?.label;
  const fileNameVeh = dateTime + " " + selectVehicle?.label;

  function handleGenExcelByFleet() {
    console.log("fire Gen Excel");
    excelOilReportByFleet(
      tableReport,
      fileName,
      selectFleet?.label,
      dateStartChange,
      dateEndChange,
      valueOil
    );
  }

  function handleGenExcelByVeh() {
    console.log("fire Gen Excel");
    excelOilReportByVeh(
      tableReportVeh,
      fileNameVeh,
      selectFleet?.label,
      selectVehicle?.label,
      dateStartChange,
      dateEndChange,
      valueOil
    );
  }

  function handleGenPDFByFleet() {
    console.log("fire Gen PDF");
    generatePDFOilReportByFleet(
      tableReport,
      fileName,
      selectFleet?.label,
      dateStartChange,
      dateEndChange,
      valueOil
    );
  }

  function handleGenPDFByVeh() {
    console.log("fire Gen PDF");
    generatePDFOilReportByVeh(
      tableReportVeh,
      fileNameVeh,
      selectFleet?.label,
      selectVehicle?.label,
      dateStartChange,
      dateEndChange,
      valueOil
    );
  }

  const [credentials, setCredentials] = useState<IVehtype>({
    veh_id: 0,
    vehType_id: 0,
  });

  //Insert or update vehicle type
  useEffect(() => {
    const result = axios
      .get(
        `http://localhost:5000/api/vehicle/vehVehType/${credentials.veh_id}/${credentials.vehType_id}`,
        config
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [credentials]);

  //Function auto refresh page
  function refreshPage() {
    window.location.reload();
  }

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
            {/* selected === "no" เเสดงข้อมูลของยานยนต์ที่เลือก */}
            {selected == "no" ? (
              <>
                <button
                  className=" w-96 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#628A71] hover:border-[#547762] hover:bg-[#628A71] hover:text-white shadow-md shadow-[#628A71] dark:shadow-[#628A71] py-2 px-6 inline-flex items-center justify-center"
                  // disabled={shouldFetch}
                  onClick={handleSearchReportByVeh}
                >
                  <span className="mx-auto">ค้นหาโดยยานยนต์</span>
                </button>
                <button
                  className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-green-500 hover:border-green-600 hover:bg-green-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                  onClick={handleGenExcelByVeh}
                >
                  <img src={excel} className=" h-6 mx-auto " />
                </button>
                <button
                  className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-red-500 hover:border-red-600 hover:bg-red-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                  onClick={handleGenPDFByVeh}
                >
                  <img src={pdf} className=" h-6 mx-auto " />
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
                <button
                  className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-green-500 hover:border-green-600 hover:bg-green-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                  onClick={handleGenExcelByFleet}
                >
                  <img src={excel} className=" h-6 mx-auto " />
                </button>
                <button
                  className=" w-auto bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-red-500 hover:border-red-600 hover:bg-red-200 hover:text-white shadow-md py-2 px-6 inline-flex items-center"
                  onClick={handleGenPDFByFleet}
                >
                  <img src={pdf} className=" h-6 mx-auto " />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Setting vehicle type */}
      {/* setting === "true" เเสดงหน้าตั้งค่าประเภทยานยนต์ */}
      {setting === "true" ? (
        <div className="flex flex-col items-center justify-center gap-5 pb-10">
          <div className=" grid grid-cols-4 items-center justify-center gap-3">
            {tableReport
              ? tableReport.map((item: IOil) => (
                  <div className="flex flex-row items-center justify-between w-60 xl:w-80 border rounded-lg py-3 px-5">
                    <input
                      className=" dark:text-white w-28 hidden"
                      name="veh_id"
                      type="text"
                      value={item.veh_id}
                      // onChange={handleType}
                      disabled
                    />
                    <label className="dark:text-white">
                      {item.registration}
                    </label>
                    <select
                      name="vehType_id"
                      id="vehType"
                      className="font-mono text-xs text-center text-black dark:bg-[#000000] dark:text-white"
                      onChange={(e) =>
                        setCredentials((prevState) => ({
                          ...prevState,
                          [e.target.name]: parseInt(e.target.value),
                          veh_id: item.veh_id,
                        }))
                      }
                    >
                      {item.veh_type.toString() === "0" ? (
                        <option hidden disabled selected value="0">
                          เลือกประเภทของยานยนต์
                        </option>
                      ) : (
                        <option
                          hidden
                          disabled
                          selected
                          value={item.veh_type_value}
                        >
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
          <div className="flex flex-row items-center justify-center gap-5">
            <button
              className=" w-60 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-[#c88334] hover:border-[#a0692a] hover:bg-[#c88334] hover:text-white shadow-md shadow-[#c88334] dark:shadow-[#c88334] py-2 px-6 inline-flex items-center justify-center"
              //disabled={shouldFetch}
              onClick={() => {
                setSetting("false");
                setShouldFetch(false);
                refreshPage();
              }}
            >
              <span className="mx-auto">ย้อนกลับ</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Display report in table*/}
          {selected === "yes" ? (
            <section className="container mx-auto font-mono">
              {/* selected === "yes" เเสดงข้อมูลของยานยนต์ทั้งหมด */}
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
                                  {item.oil1 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil1 == "-"
                                        ? "-"
                                        : isNaN(
                                            parseFloat(item.dis1) /
                                              parseInt(item.oil1)
                                          )
                                        ? "0.000"
                                        : (
                                            parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                          ).toFixed(3)}
                                    </>
                                  )}
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
                                  {item.oil2 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil2.toString() == "-"
                                        ? "-"
                                        : (
                                            parseFloat(item.dis2) /
                                            Math.abs(parseInt(item.oil2))
                                          ).toFixed(3)}
                                    </>
                                  )}
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
                                  {item.oil3 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {isNaN(
                                        parseFloat(item.dis3) /
                                          parseInt(item.oil3)
                                      )
                                        ? "-"
                                        : (
                                            parseFloat(item.dis3) /
                                            Math.abs(parseInt(item.oil3))
                                          ).toFixed(3)}
                                    </>
                                  )}
                                </td>

                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil1 == "-" ||
                                  item.oil1 == "0" ||
                                  item.oil2 == "0" ||
                                  item.oil3 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil2 == "-" ? (
                                        isNaN(
                                          parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                        ) ? (
                                          "0.000"
                                        ) : (
                                          (
                                            parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                          ).toFixed(3)
                                        )
                                      ) : (
                                        <>
                                          {item.oil3 == "-"
                                            ? (
                                                (isNaN(
                                                  parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    )
                                                )
                                                  ? 0 +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )
                                                  : parseFloat(item.dis1) /
                                                      Math.abs(
                                                        parseInt(item.oil1)
                                                      ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) / item.average
                                              ).toFixed(3)
                                            : (
                                                (isNaN(
                                                  parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    )
                                                )
                                                  ? 0 +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      ) +
                                                    parseFloat(item.dis3) /
                                                      Math.abs(
                                                        parseInt(item.oil3)
                                                      )
                                                  : parseFloat(item.dis1) /
                                                      Math.abs(
                                                        parseInt(item.oil1)
                                                      ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      ) +
                                                    parseFloat(item.dis3) /
                                                      Math.abs(
                                                        parseInt(item.oil3)
                                                      )) / item.average
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
                                  {item.oil1 == "-" ||
                                  item.oil1 == "0" ||
                                  item.oil2 == "0" ||
                                  item.oil3 == "0" ||
                                  item.veh_type == "0" ? (
                                    <td className="text-black text-sm border dark:border-gray-600">
                                      -
                                    </td>
                                  ) : (
                                    <>
                                      {item.oil2 == "-" ? (
                                        isNaN(
                                          parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                        ) ? (
                                          "0.000"
                                        ) : (
                                            (parseFloat(item.dis1) /
                                              Math.abs(parseInt(item.oil1)) -
                                              parseFloat(item.veh_type_value)) *
                                            parseFloat(
                                              valueOil ? valueOil : "0"
                                            )
                                          )
                                            .toString()
                                            .substring(1, 0) == "-" ? (
                                          <td className="text-red-500 text-sm border dark:border-gray-600">
                                            {(
                                              (parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            ).toFixed(1)}
                                          </td>
                                        ) : (
                                          <td className="text-black text-sm border dark:border-gray-600">
                                            {(
                                              (parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            ).toFixed(1)}
                                          </td>
                                        )
                                      ) : (
                                        <>
                                          {item.oil3 == "-" ? (
                                            (
                                              ((parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) +
                                                parseFloat(item.dis2) /
                                                  Math.abs(
                                                    parseInt(item.oil2)
                                                  )) /
                                                item.average -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            )
                                              .toString()
                                              .substring(1, 0) == "-" ? (
                                              <td className="text-red-500 text-sm border dark:border-gray-600">
                                                {(
                                                  ((parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) /
                                                    item.average -
                                                    parseFloat(
                                                      item.veh_type_value
                                                    )) *
                                                  parseFloat(
                                                    valueOil ? valueOil : "0"
                                                  )
                                                ).toFixed(1)}
                                              </td>
                                            ) : (
                                              <td className="text-black text-sm border dark:border-gray-600">
                                                {(
                                                  ((parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) /
                                                    item.average -
                                                    parseFloat(
                                                      item.veh_type_value
                                                    )) *
                                                  parseFloat(
                                                    valueOil ? valueOil : "0"
                                                  )
                                                ).toFixed(1)}
                                              </td>
                                            )
                                          ) : (
                                              ((parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) +
                                                parseFloat(item.dis2) /
                                                  Math.abs(
                                                    parseInt(item.oil2)
                                                  ) +
                                                parseFloat(item.dis3) /
                                                  Math.abs(
                                                    parseInt(item.oil3)
                                                  )) /
                                                item.average -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            )
                                              .toString()
                                              .substring(1, 0) == "-" ? (
                                            <td className="text-red-500 text-sm border dark:border-gray-600">
                                              {(
                                                ((parseFloat(item.dis1) /
                                                  Math.abs(
                                                    parseInt(item.oil1)
                                                  ) +
                                                  parseFloat(item.dis2) /
                                                    Math.abs(
                                                      parseInt(item.oil2)
                                                    ) +
                                                  parseFloat(item.dis3) /
                                                    Math.abs(
                                                      parseInt(item.oil3)
                                                    )) /
                                                  item.average -
                                                  parseFloat(
                                                    item.veh_type_value
                                                  )) *
                                                parseFloat(
                                                  valueOil ? valueOil : "0"
                                                )
                                              ).toFixed(1)}
                                            </td>
                                          ) : (
                                            <td className="text-black text-sm border dark:border-gray-600">
                                              {(
                                                ((parseFloat(item.dis1) /
                                                  Math.abs(
                                                    parseInt(item.oil1)
                                                  ) +
                                                  parseFloat(item.dis2) /
                                                    Math.abs(
                                                      parseInt(item.oil2)
                                                    ) +
                                                  parseFloat(item.dis3) /
                                                    Math.abs(
                                                      parseInt(item.oil3)
                                                    )) /
                                                  item.average -
                                                  parseFloat(
                                                    item.veh_type_value
                                                  )) *
                                                parseFloat(
                                                  valueOil ? valueOil : "0"
                                                )
                                              ).toFixed(1)}
                                            </td>
                                          )}
                                        </>
                                      )}
                                    </>
                                    // <>
                                    //   {(
                                    //     (parseFloat(
                                    //       (
                                    //         parseFloat(item.totleDis) /
                                    //         parseInt(item.totleOil)
                                    //       )
                                    //         .toFixed(3)
                                    //         .toString()
                                    //     ) -
                                    //       parseFloat(item.veh_type_value)) *
                                    //     parseFloat(valueOil ? valueOil : "0")
                                    //   )
                                    //     .toString()
                                    //     .substring(1, 0) == "-" ? (
                                    //     <td className="text-red-500 text-sm border dark:border-gray-600">

                                    //     </td>
                                    //   ) : (
                                    //     <td className="text-sm border dark:border-gray-600">
                                    //       {(
                                    //         (parseFloat(
                                    //           (
                                    //             parseFloat(item.totleDis) /
                                    //             parseInt(item.totleOil)
                                    //           )
                                    //             .toFixed(3)
                                    //             .toString()
                                    //         ) -
                                    //           parseFloat(item.veh_type_value)) *
                                    //         parseFloat(
                                    //           valueOil ? valueOil : "0"
                                    //         )
                                    //       ).toFixed(3)}
                                    //     </td>
                                    //   )}
                                    // </>
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
              {/* selected === "no" เเสดงข้อมูลของยานยนต์ที่เลือก */}
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
                        {tableReportVeh
                          ? tableReportVeh.map((item: IOil, i: number) => (
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
                                  {item.oil1 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil1 == "-"
                                        ? "-"
                                        : isNaN(
                                            parseFloat(item.dis1) /
                                              parseInt(item.oil1)
                                          )
                                        ? "0.000"
                                        : (
                                            parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                          ).toFixed(3)}
                                    </>
                                  )}
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
                                  {item.oil2 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil2.toString() == "-"
                                        ? "-"
                                        : (
                                            parseFloat(item.dis2) /
                                            Math.abs(parseInt(item.oil2))
                                          ).toFixed(3)}
                                    </>
                                  )}
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
                                  {item.oil3 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {isNaN(
                                        parseFloat(item.dis3) /
                                          parseInt(item.oil3)
                                      )
                                        ? "-"
                                        : (
                                            parseFloat(item.dis3) /
                                            Math.abs(parseInt(item.oil3))
                                          ).toFixed(3)}
                                    </>
                                  )}
                                </td>

                                <td className="px-2 py-2 text-xs border dark:border-gray-600 ">
                                  {item.oil1 == "-" ||
                                  item.oil1 == "0" ||
                                  item.oil2 == "0" ||
                                  item.oil3 == "0" ? (
                                    "-"
                                  ) : (
                                    <>
                                      {item.oil2 == "-" ? (
                                        isNaN(
                                          parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                        ) ? (
                                          "0.000"
                                        ) : (
                                          (
                                            parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                          ).toFixed(3)
                                        )
                                      ) : (
                                        <>
                                          {item.oil3 == "-"
                                            ? (
                                                (isNaN(
                                                  parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    )
                                                )
                                                  ? 0 +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )
                                                  : parseFloat(item.dis1) /
                                                      Math.abs(
                                                        parseInt(item.oil1)
                                                      ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) / item.average
                                              ).toFixed(3)
                                            : (
                                                (isNaN(
                                                  parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    )
                                                )
                                                  ? 0 +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      ) +
                                                    parseFloat(item.dis3) /
                                                      Math.abs(
                                                        parseInt(item.oil3)
                                                      )
                                                  : parseFloat(item.dis1) /
                                                      Math.abs(
                                                        parseInt(item.oil1)
                                                      ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      ) +
                                                    parseFloat(item.dis3) /
                                                      Math.abs(
                                                        parseInt(item.oil3)
                                                      )) / item.average
                                              ).toFixed(3)}
                                        </>
                                      )}
                                    </>
                                    // <>
                                    //   {(
                                    //     parseFloat(item.totleDis) /
                                    //     parseInt(item.totleOil)
                                    //   ).toFixed(3)}
                                    // </>
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
                                  {item.oil1 == "-" ||
                                  item.oil1 == "0" ||
                                  item.oil2 == "0" ||
                                  item.oil3 == "0" ||
                                  item.veh_type == "0" ? (
                                    <td className="text-black text-sm border dark:border-gray-600">
                                      -
                                    </td>
                                  ) : (
                                    <>
                                      {item.oil2 == "-" ? (
                                        isNaN(
                                          parseFloat(item.dis1) /
                                            Math.abs(parseInt(item.oil1))
                                        ) ? (
                                          "0.000"
                                        ) : (
                                            (parseFloat(item.dis1) /
                                              Math.abs(parseInt(item.oil1)) -
                                              parseFloat(item.veh_type_value)) *
                                            parseFloat(
                                              valueOil ? valueOil : "0"
                                            )
                                          )
                                            .toString()
                                            .substring(1, 0) == "-" ? (
                                          <td className="text-red-500 text-sm border dark:border-gray-600">
                                            {(
                                              (parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            ).toFixed(1)}
                                          </td>
                                        ) : (
                                          <td className="text-black text-sm border dark:border-gray-600">
                                            {(
                                              (parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            ).toFixed(1)}
                                          </td>
                                        )
                                      ) : (
                                        <>
                                          {item.oil3 == "-" ? (
                                            (
                                              ((parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) +
                                                parseFloat(item.dis2) /
                                                  Math.abs(
                                                    parseInt(item.oil2)
                                                  )) /
                                                item.average -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            )
                                              .toString()
                                              .substring(1, 0) == "-" ? (
                                              <td className="text-red-500 text-sm border dark:border-gray-600">
                                                {(
                                                  ((parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) /
                                                    item.average -
                                                    parseFloat(
                                                      item.veh_type_value
                                                    )) *
                                                  parseFloat(
                                                    valueOil ? valueOil : "0"
                                                  )
                                                ).toFixed(1)}
                                              </td>
                                            ) : (
                                              <td className="text-black text-sm border dark:border-gray-600">
                                                {(
                                                  ((parseFloat(item.dis1) /
                                                    Math.abs(
                                                      parseInt(item.oil1)
                                                    ) +
                                                    parseFloat(item.dis2) /
                                                      Math.abs(
                                                        parseInt(item.oil2)
                                                      )) /
                                                    item.average -
                                                    parseFloat(
                                                      item.veh_type_value
                                                    )) *
                                                  parseFloat(
                                                    valueOil ? valueOil : "0"
                                                  )
                                                ).toFixed(1)}
                                              </td>
                                            )
                                          ) : (
                                              ((parseFloat(item.dis1) /
                                                Math.abs(parseInt(item.oil1)) +
                                                parseFloat(item.dis2) /
                                                  Math.abs(
                                                    parseInt(item.oil2)
                                                  ) +
                                                parseFloat(item.dis3) /
                                                  Math.abs(
                                                    parseInt(item.oil3)
                                                  )) /
                                                item.average -
                                                parseFloat(
                                                  item.veh_type_value
                                                )) *
                                              parseFloat(
                                                valueOil ? valueOil : "0"
                                              )
                                            )
                                              .toString()
                                              .substring(1, 0) == "-" ? (
                                            <td className="text-red-500 text-sm border dark:border-gray-600">
                                              {(
                                                ((parseFloat(item.dis1) /
                                                  Math.abs(
                                                    parseInt(item.oil1)
                                                  ) +
                                                  parseFloat(item.dis2) /
                                                    Math.abs(
                                                      parseInt(item.oil2)
                                                    ) +
                                                  parseFloat(item.dis3) /
                                                    Math.abs(
                                                      parseInt(item.oil3)
                                                    )) /
                                                  item.average -
                                                  parseFloat(
                                                    item.veh_type_value
                                                  )) *
                                                parseFloat(
                                                  valueOil ? valueOil : "0"
                                                )
                                              ).toFixed(1)}
                                            </td>
                                          ) : (
                                            <td className="text-black text-sm border dark:border-gray-600">
                                              {(
                                                ((parseFloat(item.dis1) /
                                                  Math.abs(
                                                    parseInt(item.oil1)
                                                  ) +
                                                  parseFloat(item.dis2) /
                                                    Math.abs(
                                                      parseInt(item.oil2)
                                                    ) +
                                                  parseFloat(item.dis3) /
                                                    Math.abs(
                                                      parseInt(item.oil3)
                                                    )) /
                                                  item.average -
                                                  parseFloat(
                                                    item.veh_type_value
                                                  )) *
                                                parseFloat(
                                                  valueOil ? valueOil : "0"
                                                )
                                              ).toFixed(1)}
                                            </td>
                                          )}
                                        </>
                                      )}
                                    </>
                                    // <>
                                    //   {(
                                    //     (parseFloat(
                                    //       (
                                    //         parseFloat(item.totleDis) /
                                    //         parseInt(item.totleOil)
                                    //       )
                                    //         .toFixed(3)
                                    //         .toString()
                                    //     ) -
                                    //       parseFloat(item.veh_type_value)) *
                                    //     parseFloat(valueOil ? valueOil : "0")
                                    //   )
                                    //     .toString()
                                    //     .substring(1, 0) == "-" ? (
                                    //     <td className="text-red-500 text-sm border dark:border-gray-600">

                                    //     </td>
                                    //   ) : (
                                    //     <td className="text-sm border dark:border-gray-600">
                                    //       {(
                                    //         (parseFloat(
                                    //           (
                                    //             parseFloat(item.totleDis) /
                                    //             parseInt(item.totleOil)
                                    //           )
                                    //             .toFixed(3)
                                    //             .toString()
                                    //         ) -
                                    //           parseFloat(item.veh_type_value)) *
                                    //         parseFloat(
                                    //           valueOil ? valueOil : "0"
                                    //         )
                                    //       ).toFixed(3)}
                                    //     </td>
                                    //   )}
                                    // </>
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
          )}
        </>
      )}
    </div>
  );
}

export default ReportOil;
