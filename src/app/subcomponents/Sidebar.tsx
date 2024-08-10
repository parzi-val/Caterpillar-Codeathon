import React from 'react'
import Image from 'next/image'
import menu from '@/app/assets/Menu.jpg'
const Sidebar = () => {
  return (
    <aside className='h-screen'>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src="http://www.w3.org/2000/svg" className="w-32" alt="menu" />
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
