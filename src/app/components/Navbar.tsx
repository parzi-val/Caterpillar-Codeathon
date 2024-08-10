'use client'
import React,{useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import logo from '@/app/assets/Caterpillar_logo.svg'

import HamBurgerDropDown from '../subcomponents/Hamburgerdrop'


const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  //containing hydration error
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter(); //using router
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="h-[16vh] w-full bg-[#faab35] flex items-center justify-between px-5">
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-start space-y-2 md:space-y-0 md:space-x-4">
        <HamBurgerDropDown value={isOpen} handleClick={() => setIsOpen(!isOpen)}/>
      </div>
      <div className="flex-1 flex justify-center">
        <button type='button' onClick={() => router.push('/')}><Image src={logo} alt="Logo" width={100} height={100} /></button>
      </div>
      <div className="flex-1 flex justify-end">
        <button type='button' className="hover:bg-[#ed8a58] py-2 px-4" onClick={() => router.push('/')}> Sign In</button>
        <button type='button' className="hover:bg-[#ed8a58] py-2 px-4" onClick={() => router.push('/')}> Register</button>
      </div>
    </div>
  )
}

export default Navbar
