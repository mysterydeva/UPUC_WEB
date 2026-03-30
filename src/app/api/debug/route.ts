import { NextResponse } from 'next/server';

export async function GET() {
    console.log('🔍 API Route: /api/debug called');
    try {
        const { prisma } = await import('@/lib/prisma');
        console.log('📊 Testing database connection...');
        
        const leadCount = await prisma.lead.count();
        const businessCount = await prisma.business.count();
        
        console.log('📈 Database stats:', { leadCount, businessCount });
        
        return NextResponse.json({
            success: true,
            message: 'Debug API working',
            stats: {
                leadCount,
                businessCount,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('💥 Debug API error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
