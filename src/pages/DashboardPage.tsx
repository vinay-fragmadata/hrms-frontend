import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { memo, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { useGetEmployeesQuery } from '@/store/api/employeeApi'
import type { Employee } from '@/types/employee'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

function buildDonutData(employees: Employee[], key: 'department' | 'role') {
  const counts = new Map<string, number>()
  employees.forEach((employee) => {
    const name = employee[key] || 'Unknown'
    counts.set(name, (counts.get(name) ?? 0) + 1)
  })
  return [...counts.entries()].map(([name, value]) => ({ name, value }))
}

const DashboardPage = memo(function DashboardPage() {
  const { data = [], isLoading, isError, error } = useGetEmployeesQuery(undefined, {
    // Reuse cached employee data and avoid extra fetches on remount/focus.
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  const chartData = useMemo(() => {
    const employees = data
    return {
      departments: buildDonutData(employees, 'department'),
      roles: buildDonutData(employees, 'role'),
    }
  }, [data])

  const departmentOption = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' as const },
      series: [
        {
          name: 'Departments',
          type: 'pie' as const,
          radius: ['48%', '72%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}: {d}%' },
          data: chartData.departments,
        },
      ],
    }),
    [chartData.departments],
  )

  const roleOption = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' as const },
      series: [
        {
          name: 'Roles',
          type: 'pie' as const,
          radius: ['48%', '72%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
          label: { show: true, formatter: '{b}: {d}%' },
          data: chartData.roles,
        },
      ],
    }),
    [chartData.roles],
  )

  const errorMessage = useMemo(() => {
    if (!isError) return null
    return parseRtkQueryErrorMessage(error) ?? 'Unable to load dashboard charts.'
  }, [error, isError])

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Employee Distribution
      </Typography>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 2,
            height: 'calc(100% - 44px)',
          }}
        >
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                By Department
              </Typography>
              <ReactECharts
                option={departmentOption}
                style={{ height: 'calc(100% - 34px)', width: '100%' }}
              />
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                By Role
              </Typography>
              <ReactECharts
                option={roleOption}
                style={{ height: 'calc(100% - 34px)', width: '100%' }}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  )
})

export default DashboardPage
