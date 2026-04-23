import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ReactECharts from 'echarts-for-react'
import { memo, useMemo } from 'react'
import type { Timesheet } from '@/types/timesheet'
import { TIMESHEET_STATUS_OPTIONS } from '@/types/timesheet'

export interface TimesheetReportsProps {
  entries: Timesheet[]
}

export const TimesheetReports = memo(function TimesheetReports({
  entries,
}: TimesheetReportsProps) {
  const barOption = useMemo(() => {
    const byDate = new Map<string, number>()
    for (const e of entries) {
      const d = e.date?.slice(0, 10) ?? ''
      if (!d) continue
      byDate.set(d, (byDate.get(d) ?? 0) + e.hours)
    }
    const dates = [...byDate.keys()].sort()
    const values = dates.map((d) => byDate.get(d) ?? 0)
    return {
      tooltip: { trigger: 'axis' as const },
      grid: { left: 48, right: 16, top: 24, bottom: 40 },
      xAxis: {
        type: 'category' as const,
        data: dates,
        axisLabel: { rotate: dates.length > 6 ? 35 : 0 },
      },
      yAxis: {
        type: 'value' as const,
        name: 'Hours',
        minInterval: 0.5,
      },
      series: [
        {
          name: 'Hours',
          type: 'bar' as const,
          data: values,
          itemStyle: { color: '#2ECC71', borderRadius: [6, 6, 0, 0] },
        },
      ],
    }
  }, [entries])

  const donutOption = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of TIMESHEET_STATUS_OPTIONS) counts[s] = 0
    for (const e of entries) {
      counts[e.status] = (counts[e.status] ?? 0) + 1
    }
    const data = TIMESHEET_STATUS_OPTIONS.map((name) => ({
      name,
      value: counts[name] ?? 0,
    })).filter((x) => x.value > 0)

    return {
      tooltip: { trigger: 'item' as const },
      legend: { bottom: 0, type: 'scroll' as const },
      series: [
        {
          name: 'Status',
          type: 'pie' as const,
          radius: ['42%', '68%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true },
          data: data.length > 0 ? data : [{ name: 'No data', value: 1 }],
        },
      ],
    }
  }, [entries])

  if (entries.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No timesheet entries yet. Add entries to see charts.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Hours by date
        </Typography>
        <Box sx={{ height: 320 }}>
          <ReactECharts option={barOption} style={{ height: '100%' }} />
        </Box>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Entries by status
        </Typography>
        <Box sx={{ height: 360 }}>
          <ReactECharts option={donutOption} style={{ height: '100%' }} />
        </Box>
      </Paper>
    </Stack>
  )
})
