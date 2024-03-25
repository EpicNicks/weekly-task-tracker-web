import { Box, CircularProgress, Divider, IconButton, Stack } from '@mui/material'
import { useGetAllLogsInRangeQuery } from '../../../redux/services/apiSlice'
import { dateFormat } from '../../../common/DateFunctions'
import { DailyLog } from '../../../redux/responseTypes/DailyLog'
import DayOfWeek from './DayOfWeek'
import { WeeklyProgressDisplay } from './WeeklyProgressDisplay'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { createPortal } from 'react-dom'
import { DateTime } from 'luxon'


function datesThisWeek(date: Date = new Date()) {
    // get monday of provided date
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - newDate.getDay() + 1)
    const thisWeekDates = []
    for (let i = 0; i < 7; ++i) {
        thisWeekDates.push(new Date(newDate))
        newDate.setDate(newDate.getDate() + 1)
    }
    return thisWeekDates
}

export default function WeeklyView() {
    const [baseDate, setBaseDate] = useState(new Date())

    const thisWeekDates = datesThisWeek(baseDate)
    const { data, error, isLoading } = useGetAllLogsInRangeQuery({ startDate: dateFormat(thisWeekDates[0]), endDate: dateFormat(thisWeekDates[thisWeekDates.length - 1]) })

    if (isLoading) {
        return <CircularProgress />
    }
    if (!data || !data.success || error) {
        return <>An Error Has Occurred</>
    }

    const logs = data.value
    const logMap = new Map<string, DailyLog[]>()
    for (const date of thisWeekDates) {
        logMap.set(dateFormat(date, '-'), [])
    }
    for (const log of logs) {
        logMap.get(log.logDate)?.push(log)
    }

    return (
        <Box
            sx={{
                overflowX: 'auto'
            }}
        >
            <Stack direction="column">
                {
                    (() => {
                        const headerSlot = document.querySelector('#weekly-view-appbar-header-slot')
                        if (headerSlot) {
                            return createPortal(
                                (
                                    <DatePicker
                                        timezone="America/Toronto"
                                        value={DateTime.fromJSDate(thisWeekDates[0])}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                setBaseDate(newValue.toJSDate())
                                            }
                                        }}
                                    />
                                ),
                                headerSlot
                            )
                        }
                    })()
                }
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    divider={<Divider orientation="vertical" flexItem />}
                    minHeight="50vh"
                    sx={{ backgroundColor: 'white' }}
                >
                    {
                        thisWeekDates.map((date, index) => {
                            return (
                                <>
                                    {index === 0 && (
                                        <IconButton
                                            onClick={() => {
                                                setBaseDate((prevDate) => {
                                                    const newDate = new Date(prevDate)
                                                    newDate.setDate(newDate.getDate() - 7)
                                                    return newDate
                                                })
                                            }}
                                        >
                                            <ArrowLeft />
                                        </IconButton>
                                    )}
                                    <DayOfWeek date={date} logs={logMap.get(dateFormat(date, '-')) ?? []} />
                                    {index === 6 && (
                                        <IconButton
                                            onClick={() => {
                                                setBaseDate((prevDate) => {
                                                    const newDate = new Date(prevDate)
                                                    newDate.setDate(newDate.getDate() + 7)
                                                    return newDate
                                                })
                                            }}
                                        >
                                            <ArrowRight />
                                        </IconButton>
                                    )}
                                </>
                            )
                        })
                    }
                </Stack>
                <Divider />
                <Box
                    minHeight="44.5vh"
                    sx={{ backgroundColor: 'white' }}
                >
                    <WeeklyProgressDisplay weekLogs={logMap} />
                </Box>
            </Stack>
        </Box>
    )
}