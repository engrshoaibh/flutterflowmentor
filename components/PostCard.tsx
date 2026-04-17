import Image from 'next/image'
import Link from 'next/link'

interface Props {
    image: string
    title: string
    slug: string
    tags: string[]
    date: string
    author: string
   
}

const PostCard = ({image, title, slug, tags, date, author}: Props) => {
  return (
            <Link href={`/posts/${slug}`} id='post-card'>
                <div className='post-card-image'>
                    <Image src={image} alt='Post Card Image' width={416} height={234} className='w-full h-full object-cover rounded-lg'    />
                </div>
                <div className='post-card-content'>
                    <h3>{title}</h3>
                    <div className='datetime'>
                        <div>
                            <p>{date}</p>
                        </div>
                        <div>
                            <p>{author}</p>
                        </div>
                    </div>
                    <div className='tags'>
                        {tags.map((tag) => (
                            <p key={tag}>{tag}</p>
                        ))}
                    </div>
                </div>
            </Link>
  )
}

export default PostCard