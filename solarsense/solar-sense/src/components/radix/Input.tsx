import * as Label from "@radix-ui/react-label";

interface Props {
  content: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
export const Input = ({ content, id, value, placeholder, onChange }: Props) => (
  <div className="flex w-full flex-col flex-wrap items-start">
    <Label.Root
      className="text-[15px] font-medium leading-[35px] text-darkGray"
      htmlFor={id}
    >
      {content}
    </Label.Root>
    <input
      className="selection:color-white inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-md bg-gray bg-opacity-15 px-[10px] text-[15px] leading-none placeholder-gray shadow-[0_0_0_1px] shadow-darkGray outline-none focus:shadow-[0_0_0_2px_black]"
      type="text"
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);
