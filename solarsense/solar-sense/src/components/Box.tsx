import React from "react";

interface Props {
  massage: string | number | null;
  context: string | number | null;
  units?: string;
  variant?:
    | "xy"
    | "2xy"
    | "x2y"
    | "2x2y"
    | "3xy"
    | `${"xy" | "2xy" | "x2y" | "2x2y" | "3xy"} ${"xy" | "2xy" | "x2y" | "2x2y" | "3xy"}`;
  extraStyle?: string;
  extraData?: (string | number | null)[];
}

export const Box = ({
  massage,
  context,
  units,
  variant = "xy",
  extraStyle,
  extraData = [],
}: Props) => {
  let largeScreenStyle = "";
  let smallScreenStyle = "";

  const [largeVariant, smallVariant] = variant.split(" ") || [variant, variant];

  switch (largeVariant) {
    case "xy":
      largeScreenStyle = "sm:col-span-1 sm:row-span-1";
      break;
    case "2xy":
      largeScreenStyle = "sm:col-span-2 sm:row-span-1";
      break;
    case "x2y":
      largeScreenStyle = "sm:col-span-1 sm:row-span-2";
      break;
    case "2x2y":
      largeScreenStyle = "sm:col-span-2 sm:row-span-2";
      break;
    case "3xy":
      largeScreenStyle = "sm:col-span-3 sm:row-span-1";
      break;
    default:
      largeScreenStyle = "sm:col-span-1 sm:row-span-1";
  }

  switch (smallVariant) {
    case "xy":
      smallScreenStyle = "col-span-1 row-span-1";
      break;
    case "2xy":
      smallScreenStyle = "col-span-2 row-span-1";
      break;
    case "x2y":
      smallScreenStyle = "col-span-1 row-span-2 ";
      break;
    case "2x2y":
      smallScreenStyle = "col-span-2 row-span-2";
      break;
    case "3xy":
      smallScreenStyle = "col-span-3 row-span-1";
      break;
    default:
      smallScreenStyle = "col-span-1 row-span-1";
  }

  return (
    <div
      className={`grid-item flex flex-col items-center justify-center rounded-md bg-background p-4 text-center shadow-md ${largeScreenStyle} ${smallScreenStyle} ${extraStyle}`}
    >
      <p className="font-medium text-gray">{massage}</p>
      <p className="text-3xl">
        {context} <span className="text-lg">{units}</span>
      </p>
      {extraData
        .filter(
          (value): value is string | number => value !== null && value !== 0,
        )
        .map((value, index) => (
          <React.Fragment key={index}>
            <div>
              <p className="text-black">
                {index + 1}.{" "}
                <span className={`${extraStyle}`}>{value.toString()}</span>
                <span className={`text-xs ${extraStyle}`}> {units}</span>{" "}
              </p>
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};
