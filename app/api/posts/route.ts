import { NextRequest, NextResponse } from 'next/server'
import Post from '@/database/post.model'
import connectDB from '@/lib/mongodb'

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const posts = await Post.find()
        return NextResponse.json({ success: true, data: posts })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Error fetching posts' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        let body: unknown;
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ success: false, message: 'Request body must be valid JSON' }, { status: 400 })
        }

        const createdPost = await Post.create(body as Record<string, unknown>)
        return NextResponse.json({ success: true, post: createdPost, message: 'Post created successfully' }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error creating post'
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}