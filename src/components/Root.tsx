import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function Root() {
  return (
    <div className="flex flex-col items-center justify-between">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
