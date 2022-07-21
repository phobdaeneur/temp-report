import { IVehicleReport } from "../components/TempReport";

const preDistance = <T extends IVehicleReport>(
  arr: T[],
  index: number
): string | null => {
  // var index: number | null = null;
  // for (let i = 0; i < arr.length; i++) {
  //   if (arr[i].distance === null) {
  //     index = i;
  //   }
  // }
  // console.log("index", parseFloat(arr[index - 1].distance).toFixed(3));
  return (arr[index].distance = parseFloat(arr[index - 1].distance).toFixed(3));
};

export { preDistance };
