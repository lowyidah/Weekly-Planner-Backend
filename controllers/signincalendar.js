
const handleSignincalendar = (req, res) => {
    const { accessToken } = req.body;

    // Require google from googleapis package.
    const { google } = require('googleapis');
    // Require oAuth2 from our google instance.
    const oAuth2Client = new google.auth.OAuth2(
        '353820592491-bt1jlb4iuf7d8f6f3iu5prh797q08umm.apps.googleusercontent.com',
        'pvpvuicmjasyuJSgfIEDlCBB'
    );

    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
        access_token: accessToken
    })
    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    function listEvents() {
        let timeMin = new Date();
        timeMin.setDate(0);
        let timeMax = new Date();
        timeMax.setDate(63);
        calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        //maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
        // privateExtendedProperty: 'weeklyPlannerEvent=yes'
        }, 
        (err, response) => {
        if (err) return res.status(400).json('The gcal API returned an error: ' + err);
        const events = response.data.items;
        let gcalEvents = []
        events.forEach(event => {
            if (!event.extendedProperties || !event.extendedProperties.private || !event.extendedProperties.private.weeklyPlannerEvent
            || !event.extendedProperties.private.weeklyPlannerEvent === 'yes') {
                let attendance;
                if (!event.attendees) {
                attendance = 'accepted';
                }
                else {
                attendance = event.attendees[0].responseStatus;
                }
                const gcalEvent = {
                title: event.summary,
                details: event.description,
                start: event.start.dateTime,
                end: event.end.dateTime,
                id: event.id,
                attendance: attendance
                }
                gcalEvents.push(gcalEvent)
            }
        })
        res.json(gcalEvents);
        });
    }
    listEvents();
}

module.exports = {
    handleSignincalendar: handleSignincalendar
}