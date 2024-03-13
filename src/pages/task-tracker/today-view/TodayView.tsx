import { Box, Card, CircularProgress, Container } from '@mui/material'
import DailyTaskCard from '../common/DailyTaskCard'
import { useAppSelector } from '../../../redux/hooks'
import { useGetAllTasksQuery } from '../../../redux/services/apiSlice'

export default function TodayView() {
    const cardStyle = useAppSelector(state => state.userPrefs.taskDisplayMode)

    // const { data, error, isFetching } = useGetAllTasksQuery()
    // if (isFetching) {
    //     return <CircularProgress />
    // }
    // if (!data || !data.success || error) {
    //     return <>Loading...</>
    // }
    // if (data.value.length === 0){
    //     // task list empty add a task behaviour
    //     // give a tutorial that redirects the user to task-list in tutorial mode or something
    // }

    // FOR TESTING
    return (
        <>
            <Container maxWidth="lg">
                <Card variant="outlined">
                    <Container maxWidth="md">
                        <Box mt={2} mb={4}>
                            <DailyTaskCard
                                taskColor={`#${'FF0000FF'}`}
                                cardStyle={cardStyle}
                                taskName="Sketching Practice"
                                minutesLogged={100}
                            />
                        </Box>
                    </Container>
                </Card>
            </Container>
        </>
    )
}