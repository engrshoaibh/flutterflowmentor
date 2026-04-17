
import React from 'react'

import LightRays from '@/components/LightRays'
import GetStartedBtn from '@/components/getStartedBtn'
import PostCard from '@/components/PostCard'
import { posts } from '@/lib/constants'
import { capturePageView } from '@/lib/analytics/pageViews'


const Home = async () => {
  await capturePageView('/')

  return (
    <section >
      <div className="absolute inset-0 z-[-1] min-h-screen">

        <LightRays
          raysOrigin="top-center"
          raysColor="#6366F1"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.4}
        />

      </div>

      <div className='relative z-10 flex flex-col items-center justify-center py-48'>
        <h1 className='text-center'>Stop Getting Stuck in FlutterFlow. Start Building with Confidence.</h1>
        <p className='text-center pt-5'>FlutterFlow Mentor is a focused knowledge hub for developers who want fast, practical solutions—not theory. <br /> We break down real-world errors, bugs, and implementation challenges into clear, actionable guides so you can build faster and smarter.</p>
        <div className='pt-10'>
          <GetStartedBtn />
        </div>
      </div>

      <div id='posts' className='mt-10 space-y-2' >
      <h3>Latest Posts</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>  
        {posts.map((post) => (
          <PostCard key={post.id} image={post.image} title={post.title} slug={post.slug} tags={post.tags} date={post.date} author={post.author}  />
        ))}
      </div>
    </div>
  </section>
);
};

export default Home;