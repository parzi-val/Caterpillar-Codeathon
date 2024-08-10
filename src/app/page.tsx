import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('./assets/Hero.png')" }}>
      <Navbar  />

      <div className="flex flex-row justify-center items-center h-full">
        <button className="bg-[#faab35] text-white px-6 py-3 m-4 rounded-md hover:bg-[#c17035]">
          Manual Operation
        </button>
        <button className="bg-[#faab35] text-white px-6 py-3 m-4 rounded-md hover:bg-[#c17035]">
          Voice assistance
        </button>
      </div>
    </main>
  );
}
