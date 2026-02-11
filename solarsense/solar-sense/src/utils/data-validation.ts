import { ApiDataType, ApiSuccessResult } from "../data/api-data-type";

export const isValidApiData = (data: unknown): data is ApiDataType => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const typedData = data as ApiDataType;

  if (typeof typedData.success !== 'boolean') {
    return false;
  }

  if (typeof typedData.exception !== 'string') {
    return false;
  }

  if (typeof typedData.code !== 'number') {
    return false;
  }

  if (typedData.success) {
    const result = typedData.result;

    if (typeof result !== 'object' || result === null) {
      return false;
    }

    const typedResult = result as ApiSuccessResult;

    return (
      typeof typedResult.inverterSN === 'string' &&
      typeof typedResult.sn === 'string' &&
      typeof typedResult.acpower === 'number' &&
      typeof typedResult.yieldtoday === 'number' &&
      typeof typedResult.yieldtotal === 'number' &&
      typeof typedResult.feedinpower === 'number' &&
      typeof typedResult.feedinenergy === 'number' &&
      typeof typedResult.consumeenergy === 'number' &&
      typeof typedResult.feedinpowerM2 === 'number' &&
      typeof typedResult.soc === 'number' &&
      typeof typedResult.peps1 === 'number' &&
      typeof typedResult.peps2 === 'number' &&
      typeof typedResult.peps3 === 'number' &&
      typeof typedResult.inverterType === 'string' &&
      typeof typedResult.inverterStatus === 'string' &&
      typeof typedResult.uploadTime === 'string' &&
      typeof typedResult.batPower === 'number' &&
      typeof typedResult.powerdc1 === 'number' &&
      typeof typedResult.powerdc2 === 'number' &&
      (typedResult.powerdc3 === null || typeof typedResult.powerdc3 === 'number') &&
      (typedResult.powerdc4 === null || typeof typedResult.powerdc4 === 'number') &&
      typeof typedResult.batStatus === 'string'
    );
  } else {
    return typeof typedData.result === 'string';
  }
};
