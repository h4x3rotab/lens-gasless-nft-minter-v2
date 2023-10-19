import backgroundCube from "@public/assets/background-cube.svg";
import Image from "next/image";

export default function BackgroundCube() {
  return (
    <div className="absolute top-0 left-0 z-10 w-screen bg-gradient-to-br from-[#73FCC2] to-[#50D5FF] flex ">
      <div className="absolute top-[-201px] left-[-200.131px] hidden md:flex opacity-50">
        <Image src={backgroundCube} alt="green-bubble" />
      </div>
    </div>
  );
}
