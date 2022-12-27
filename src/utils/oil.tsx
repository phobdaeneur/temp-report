import { IVehicleOn, IVehicleOnToOff } from "../components/OilReport";

const oilsensor = (
  onToOffData: IVehicleOnToOff[] | undefined,
  onData: IVehicleOn
) => {
  var dt: any[] = [];
  const max = onToOffData
    ? onToOffData.map(() => {
        if (onToOffData === undefined || onToOffData === null) {
          return;
        } else {
          let arr = [];
          for (let a = 0; a < onToOffData.length - 1; a++) {
            arr.push(onToOffData[a].oil);
          }
          return Math.max(...arr.map((item) => (isNaN(+item) ? 0 : +item)));
        }
      })
    : undefined;
  if (onToOffData ? onToOffData.length : 0 > 5) {
    var maxOil: number = parseInt(max ? max[0]!.toString() : "0");
    if (maxOil - parseInt(onData.oil_off) > 20) {
      dt.push({
        local_timestamp: onData.local_timestamp,
        maxOil,
        distance: onData.distance,
        time_off: onData.time_off,
        oil_off: onData.oil_off,
        distance_off: onData.distance_off,
      });
    } else {
      return;
    }
  }
  return dt;
};

export { oilsensor };
