import { Box } from "../components/Box";
import { useApiContext } from "../services/ApiService";
import { formatDate } from "../utils/date-formatting";
import { useTranslation } from "react-i18next";

export const DataGrid = () => {
  const { data } = useApiContext();

  const { t } = useTranslation();

  return (
    <>
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {typeof data.result === "object" && data.result !== null ? (
            <>
              <Box
                massage={t("production.time")}
                context={formatDate(data.result.uploadTime)}
              />

              <Box
                massage={t("production.pvpower")}
                context={data.result.acpower}
                units="W"
                variant="x2y 2x2y"
                extraStyle="text-darkYellow"
                extraData={[
                  data.result.powerdc1,
                  data.result.powerdc2,
                  data.result.powerdc3,
                  data.result.powerdc4,
                ]}
              />

              <Box
                massage={t("production.ytoday")}
                context={data.result.yieldtoday}
                units="kWh"
                extraStyle="text-green"
              />

              <Box
                massage={t("production.consumed")}
                context={
                  data?.result?.consumeenergy === 0
                    ? "--"
                    : data?.result?.consumeenergy
                }
                units="kWh"
                extraStyle="text-red"
              />

              <Box
                massage={t("production.feed")}
                context={
                  data?.result?.feedinenergy === 0
                    ? "--"
                    : data?.result?.feedinenergy
                }
                units="kWh"
                extraStyle="text-darkBlue"
              />

              <Box
                massage={t("production.ytotal")}
                context={data.result.yieldtotal}
                units="MWh"
                variant="xy 3xy"
                extraStyle="text-purple"
              />
            </>
          ) : (
            <p>Invalid data format</p>
          )}
        </div>
      )}
    </>
  );
};
