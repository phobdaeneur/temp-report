const analog = (
  maxFuelVoltage: number,
  maxFuel: number,
  analog_level: number, //
  maxEmptyValtage: number
) => {
  var dFuelF: number = 0.0;
  if (maxFuel > 0) {
    if (maxEmptyValtage < maxFuelVoltage) {
      if (analog_level >= maxFuelVoltage) {
        dFuelF = maxFuel;
      } else if (analog_level < maxEmptyValtage) {
        dFuelF = 0;
      } else {
        let valueDevice = maxEmptyValtage - maxFuelVoltage;
        if (valueDevice === 0) {
          valueDevice = 1.0;
        }
        dFuelF = Math.abs(
          Math.ceil(((analog_level - maxEmptyValtage) / valueDevice) * maxFuel)
        );
        dFuelF = dFuelF < 0 ? 0 : dFuelF;
      }
    } else {
      if (analog_level > maxEmptyValtage) {
        dFuelF = 0;
      } else if (analog_level < maxFuelVoltage) {
        dFuelF = maxFuel;
      } else {
        let valueDevice = maxEmptyValtage - maxFuelVoltage;
        if (valueDevice === 0) {
          valueDevice = 1.0;
        }
        dFuelF = Math.abs(
          Math.ceil(
            (maxEmptyValtage - maxFuelVoltage - analog_level) /
              (valueDevice * maxFuel)
          )
        );
        dFuelF = dFuelF < 0 ? 0 : dFuelF;
      }
    }
  }
  return dFuelF;
};

export { analog };
