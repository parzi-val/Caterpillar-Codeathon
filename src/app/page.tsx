'use client'
import Navbar from "./components/Navbar";
import {useRouter} from 'next/navigation'
export default function Home() {
  const router =useRouter();
  return (
    <main className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('./assets/Hero.png')" }}>
      <Navbar  />

      <div className="flex flex-row justify-center items-center h-full">
        <button className="bg-[#faab35] text-white px-6 py-3 m-4 rounded-md hover:bg-[#c17035]" onClick={()=> router.push('/Manual')}>
          Manual Operation
        </button>
        <button className="bg-[#faab35] text-white px-6 py-3 m-4 rounded-md hover:bg-[#c17035]"onClick={()=> router.push('/Voice')}>
          Voice assistance
        </button>
      </div>
    </main>
  );
}
