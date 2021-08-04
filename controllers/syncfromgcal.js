
const handleSyncfromgcal = (req, res, db) => {
    const { accessToken } = req.body;
    // Require google from googleapis package.
    const { google } = require('googleapis');
    // Require oAuth2 from our google instance.
    const { OAuth2 } = google.auth;
    // Create a new instance of oAuth and set our Client ID & Client Secret.
    const oAuth2Client = new OAuth2(
        '353820592491-bt1jlb4iuf7d8f6f3iu5prh797q08umm.apps.googleusercontent.com',
        'pvpvuicmjasyuJSgfIEDlCBB'
    )
    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
        access_token: accessToken
        //refresh_token: '1//04kUY5C-Y1n_wCgYIARAAGAQSNwF-L9Irj9NxcS5_Sk1oOaVNgFgA8M9HB3k2xdSzU1wlPdyE76aX_MV7Du5uSPnth6gONprrtGc',
    })
    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    let weeklyPlannerEvents = [];

    const updateItems = () => {
        const weeklyPlannerEventsArr = weeklyPlannerEvents.map(weeklyPlannerEvent => {
        const durationMilliSeconds = new Date(weeklyPlannerEvent.end) - new Date(weeklyPlannerEvent.start);
        let durationHours = Math.floor(durationMilliSeconds / 3600000);
        let durationMins = Math.floor((durationMilliSeconds - durationHours * 3600000) / 60000);
        return {   
            id: weeklyPlannerEvent.id,
            description: weeklyPlannerEvent.title,
            hours: durationHours,
            mins: durationMins,
            details: weeklyPlannerEvent.details,
            start: weeklyPlannerEvent.start,
            end: weeklyPlannerEvent.end
        }
        });
    
        Promise.all(weeklyPlannerEventsArr.map(weeklyPlannerEvent => {
        const { id, description, hours, mins, details, start, end } = weeklyPlannerEvent;
        return db('calendaritems')
        .where('id', '=', id)
        .update({
            // description: description,
            hours: hours,
            mins: mins,
            // details: details,
            starttime: start,
            endtime: end
        })
        }))
        .then(() => res.json("Updated items"))
        .catch((err) => res.status(400).json("Unable to update items in database"));
    }

    function listEvents(calendarId) {
        let timeMin = new Date();
        timeMin.setDate(0);
        let timeMax = new Date();
        timeMax.setDate(63);
        calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        //maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
        privateExtendedProperty: 'weeklyPlannerEvent=yes'
        }, 
        (err, response) => {
        if (err) return res.status(400).json('Unable to list items from primary gcal: ' + err);
        const events = response.data.items;
        events.map(event => {
            let attendance;
            if (!event.attendees) {
            attendance = 'accepted';
            }
            else {
            attendance = event.attendees[0].responseStatus;
            }
            const returnEvent =  {
            title: event.summary,
            details: event.description,
            start: event.start.dateTime,
            end: event.end.dateTime,
            id: event.extendedProperties.private.id,
            attendance: attendance
            }
            weeklyPlannerEvents.push(returnEvent);
        })
        updateItems();
        });
    }

    const getWpcalId = () => {
        calendar.calendarList.list((err, response) => {
        let weeklyCalendar;
        if(err) {
            res.status(400).json('Error listing gcals' + err);
        }
        else if (response)
            weeklyCalendar = response.data.items.filter(calendar => calendar.summary === 'Weekly Planner')[0];
            const calendarId = weeklyCalendar.id;
            listEvents(calendarId);
        })
    }

    getWpcalId();

}

module.exports = {
    handleSyncfromgcal: handleSyncfromgcal
}