import { NextResponse } from 'next/server';
import { getProviderStatusList, DEFAULT_FAILOVER_ORDER } from '@/lib/ai/config';

export async function GET() {
  try {
    const providers = getProviderStatusList();
    return NextResponse.json({
      success: true,
      providers,
      defaultFailoverOrder: DEFAULT_FAILOVER_ORDER,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve provider status' },
      { status: 500 }
    );
  }
}
