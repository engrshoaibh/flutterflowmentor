import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href={'/'} className='logo'>
                <Image src={'/images/flutterflow-mentor.png'} alt='FlutterFlow Mentor' width={50} height={50} />
                <p>FlutterFlow Mentor</p>
            </Link>

            <ul>    

                <Link href={'/'}>Home</Link>
                <Link href={'/blogs'}>Blogs</Link>
                <Link href={'/create-post'}>Create Post</Link>

            </ul>
        </nav>
    </header>
  )
}

export default Navbar