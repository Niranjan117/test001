interface Props {
  content: string;
  variant?: "primary" | "secondary" | "danger";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ content, variant, onClick }: Props) => {
  let buttonStyle = "";

  switch (variant) {
    case "primary":
      buttonStyle = "bg-darkBlue text-white";
      break;

    case "secondary":
      buttonStyle = "bg-finalBackground text-darkGray border";
      break;

    case "danger":
      buttonStyle = "bg-red text-white";
      break;

    default:
      buttonStyle = "bg-darkBlue text-white";
  }

  return (
    <button
      className={`h-[35px] w-full rounded-md px-3 py-1 font-medium hover:bg-opacity-85 ${buttonStyle}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
