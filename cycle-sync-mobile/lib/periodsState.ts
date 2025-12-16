const submitPeriodData = async (data: {
    cycleLength: string;
    newPeriod: any;
    periodLength: string;
    previousPeriod: any;
    }) => {
    try {
        const response = await fetch('https://your-api-endpoint.com/api/period', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cycle_length_days: parseInt(data.cycleLength, 10),
                last_menstruation_start: data.newPeriod ? data.newPeriod.toISOString().split('T')[0] : null,
                menstruation_length_days: parseInt(data.periodLength, 10),
                previous_period_start: data.previousPeriod ? data.previousPeriod.toISOString().split('T')[0] : null,
            }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        console.log('Success:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
};