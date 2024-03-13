import { Box, Card, Container } from '@mui/material'
import DailyTaskCard from '../common/DailyTaskCard'
import { useAppSelector } from '../../../redux/hooks'

export default function TodayView() {
    const cardStyle = useAppSelector(state => state.userPrefs.taskDisplayMode)



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