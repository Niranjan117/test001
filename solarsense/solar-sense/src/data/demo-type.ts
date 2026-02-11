export interface ResultData {
    acpower: number;
    yieldtoday: number;
    yieldtotal: number;
    feedinpower: number;
    feedinenergy: number;
    consumeenergy: number;
    feedinpowerM2: number;
    soc: number;
    peps1: number;
    peps2: number;
    peps3: number;
    inverterType: string;
    inverterStatus: string;
    uploadTime: string;
    batPower: number;
    powerdc1: number;
    powerdc2: number;
    powerdc3: number | null;
    powerdc4: number | null;
    batStatus: string;
  }
  
  export interface DemoData {
    result: ResultData;
  }
  