import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { memo, useCallback, useMemo, useState, type SyntheticEvent } from 'react'
import { AddEditTimesheet } from '@/components/timesheet/AddEditTimesheet'
import { TimesheetReports } from '@/components/timesheet/TimesheetReports'
import {
  useDeleteTimesheetMutation,
  useGetTimesheetsQuery,
} from '@/store/api/timesheetApi'
import type { Timesheet } from '@/types/timesheet'
import { parseRtkQueryErrorMessage } from '@/utils/rtkErrorMessage'

const TimesheetPage = memo(function TimesheetPage() {
  const { data: timesheets = [], isLoading, isError, error, refetch } =
    useGetTimesheetsQuery()
  const [deleteTimesheet, { isLoading: isDeleting }] = useDeleteTimesheetMutation()

  const [tab, setTab] = useState(0)
  const [drawer, setDrawer] = useState<{
    open: boolean
    entry: Timesheet | null
  }>({ open: false, entry: null })

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const listError = useMemo(() => {
    if (!isError) return null
    return parseRtkQueryErrorMessage(error) ?? 'Could not load timesheets.'
  }, [isError, error])

  const showToast = useCallback(
    (message: string, severity: 'success' | 'error') => {
      setSnackbar({ open: true, message, severity })
    },
    [],
  )

  const closeSnackbar = useCallback(() => {
    setSnackbar((s) => ({ ...s, open: false }))
  }, [])

  const openAdd = useCallback(() => {
    setDrawer({ open: true, entry: null })
  }, [])

  const openEdit = useCallback((row: Timesheet) => {
    setDrawer({ open: true, entry: row })
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawer({ open: false, entry: null })
  }, [])

  const handleTabChange = useCallback((_e: SyntheticEvent, v: number) => {
    setTab(v)
  }, [])

  const handleDelete = useCallback(
    async (row: Timesheet) => {
      try {
        const r = await deleteTimesheet(row.id).unwrap()
        showToast(r.message, 'success')
      } catch (e) {
        showToast(parseRtkQueryErrorMessage(e) ?? 'Delete failed', 'error')
      }
    },
    [deleteTimesheet, showToast],
  )

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
      >
        <Typography variant="body1" color="text.secondary">
          Track tasks, hours, and approval status. Route:{' '}
          <Box component="span" sx={{ fontFamily: 'monospace' }}>
            /timesheet
          </Box>
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Add timesheet
        </Button>
      </Stack>

      {listError ? (
        <Alert severity="error">
          {listError}
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          </Box>
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
        >
          <Tab label="Entries" />
          <Tab label="Reports" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tab === 0 ? (
            <TableContainer>
              <Table size="medium" aria-label="Timesheet entries">
                <TableHead>
                  <TableRow>
                    <TableCell width={64}>Sr. no.</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right" width={120}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography color="text.secondary">
                          Loading…
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : timesheets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography color="text.secondary">
                          No timesheet entries yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timesheets.map((row, index) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.employeeName}</TableCell>
                        <TableCell>{row.task}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right">{row.hours}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              aria-label="Edit timesheet"
                              onClick={() => openEdit(row)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                size="small"
                                aria-label="Delete timesheet"
                                color="error"
                                onClick={() => handleDelete(row)}
                                disabled={isDeleting}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TimesheetReports entries={timesheets} />
          )}
        </Box>
      </Paper>

      <AddEditTimesheet
        open={drawer.open}
        entry={drawer.entry}
        onClose={closeDrawer}
        onToast={showToast}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
})

export default TimesheetPage
