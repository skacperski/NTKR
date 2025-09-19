import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'NTKR Test Data API',
    description: 'Endpoints for generating and managing mock data for testing',
    endpoints: {
      'POST /api/dev-tools/mock-day': {
        description: 'Generate mock voice notes for a specific day',
        body: { date: 'YYYY-MM-DD' },
        example: { date: '2025-08-30' }
      },
      'POST /api/dev-tools/mock-week': {
        description: 'Generate mock voice notes for an entire week (Monday-Friday)',
        body: { weekStartDate: 'YYYY-MM-DD (Monday)' },
        example: { weekStartDate: '2025-08-26' }
      },
      'DELETE /api/dev-tools/clear-test-data?confirm=yes': {
        description: 'Clear ALL test data (voice notes, daily summaries, weekly summaries)',
        warning: 'This will delete ALL data - use with caution!',
        query_params: { confirm: 'yes' }
      }
    },
    usage_examples: {
      generate_mock_day: 'curl -X POST /api/dev-tools/mock-day -d \'{"date":"2025-08-30"}\'',
      generate_mock_week: 'curl -X POST /api/dev-tools/mock-week -d \'{"weekStartDate":"2025-08-26"}\'',
      clear_all_data: 'curl -X DELETE /api/dev-tools/clear-test-data?confirm=yes'
    },
    testing_workflow: [
      '1. Clear existing data: DELETE /api/dev-tools/clear-test-data?confirm=yes',
      '2. Generate mock week: POST /api/dev-tools/mock-week with weekStartDate',
      '3. Generate daily summary: POST /api/summaries/daily/generate with date',
      '4. Generate weekly summary: POST /api/summaries/weekly/generate with weekStartDate',
      '5. View results: GET /summaries dashboard'
    ],
    status: 'ready'
  })
}
