import { Header } from "../parts/Header";
import { LogInForm } from "../parts/LogInForm";
import img_bg from "/assets/images/pv-bg.jpg";

export const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img_bg})` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 flex w-full flex-col items-center justify-center sm:h-[80vh]">
        <div className="container flex flex-col items-center justify-around md:flex-row">
          <Header />
          <LogInForm />
        </div>
      </div>
    </div>
  );
};
