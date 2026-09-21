import { NextRequest, NextResponse } from 'next/server';
import { discoverCasePathways } from '@/lib/pathways/discoveryEngine';
import { PathwayDiscoveryInput } from '@/lib/pathways/types';

export async function POST(req: NextRequest) {
  try {
    const body: PathwayDiscoveryInput = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request: missing case information' },
        { status: 400 }
      );
    }

    const result = await discoverCasePathways(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/pathways/discover:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to discover case pathways',
      },
      { status: 500 }
    );
  }
}
