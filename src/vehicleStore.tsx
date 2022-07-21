import React, { useState, ReactNode } from "react";
import { IVehicleReport } from "./components/TempReport";

interface StoreContextType {
  vehicleReport: IVehicleReport | null;
  selectReport: (s: IVehicleReport) => void;
}

const initState = {
  vehicleReport: null,
  selectReport: () => {},
};

const VehicleStoreContext = React.createContext<StoreContextType>(initState);

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const VehicleStoreProvider = ({ children, ...props }: Props) => {
  const [vehicleReport, setVehicleReport] = useState<IVehicleReport | null>(
    null
  );
  const selectReport = (s: IVehicleReport) => {
    setVehicleReport(s);
  };

  return (
    <VehicleStoreContext.Provider
      value={{
        vehicleReport,
        selectReport,
      }}
    >
      {children}
    </VehicleStoreContext.Provider>
  );
};
export { VehicleStoreContext, VehicleStoreProvider };
