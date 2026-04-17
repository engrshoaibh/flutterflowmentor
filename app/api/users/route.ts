import { NextRequest, NextResponse } from 'next/server'
import User from '@/database/user.model'
import connectDB from '@/lib/mongodb'
import { UserType } from '@/database/user.model'

export async function POST(request: NextRequest) {
    try {
        await connectDB()
        console.log('Creating user...')
        let body: UserType;
        try {
            body = await request.json()
        } catch {
            return NextResponse.json({ success: false, message: 'Request body must be valid JSON' }, { status: 400 })
        }

        const user = await User.create(body)
        return NextResponse.json({ success: true, user: user, message: 'User created successfully' }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error creating user'
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const users = await User.find()
        return NextResponse.json({ success: true, data: users }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error fetching users'
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}
//login
export async function POST_LOGIN(request: NextRequest) {
    try {
        await connectDB()
        const body = await request.json()
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        if (user.password !== body.password) {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
        }
        return NextResponse.json({ success: true, user: user, message: 'User logged in successfully' }, { status: 200 })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error logging in user'
        return NextResponse.json({ success: false, message }, { status: 500 })
    }
}