"use client";

const GetStartedBtn = () => {
  return (
    <button id='get-started-btn' type='button'
    onClick={() => {
      const posts = document.getElementById('posts');
      if (posts) {
        posts.scrollIntoView({ behavior: 'smooth' });
      }
    }}
    >

       <a href='#posts'> Explore Posts </a>

    </button>
  );
};

export default GetStartedBtn;