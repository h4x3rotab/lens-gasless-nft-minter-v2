import Image from "next/image";
import { useRouter } from "next/navigation";
import demoLogo from "../../../public/assets/demo_logo.svg";

export default function Navbar() {
  const router = useRouter();

  return (
    <div>
      <div className="navbar font-mono">
        <div className="flex-1 ml-4">
          <div
            className="cursor-pointer flex items-center"
            onClick={() => router.push("/")}
          >
            <a
              href="https://accountkit.alchemy.com/introduction.html"
              target="_blank"
            >
              <Image src={demoLogo} alt="logo" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
