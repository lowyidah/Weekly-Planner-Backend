
const handleSavetogcal = (req, res) => {
    const { accessToken, events } = req.body;
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

    const getWpcalId = () => {
        calendar.calendarList.list((err, response) => {
        let weeklyCalendar;
        if(err) {
            res.status(400).json('Error listing weekly planner gcal' + err);
        }
        else if (response)
            weeklyCalendar = response.data.items.filter(calendar => calendar.summary === 'Weekly Planner')[0];
            let calendarId;
            if (weeklyCalendar) {
            calendarId = weeklyCalendar.id;
            deleteCalendar(calendarId);
            }
            else {
            calendarId = insertCalendar();
            }
        })
    }

    const insertCalendar = () => {
        let newCalendarId;
        plannerCalendar = {
        summary: 'Weekly Planner',
        colorId: '6'
        // timeZone: 'America/Los_Angeles'
        }

        calendar.calendars.insert({
        resource: plannerCalendar
        }, 
        (err, event) => {
        if (err) {
            res.status(400).json('Unable to insert a weekly planner calendar into gcal: ' + err);
            return;
        }
        else if (event) {
            newCalendarId = event.data.id
            insertEvents(newCalendarId);
        }
        })
        return newCalendarId;
    }

    const insertEvents = (calendarId) => {
        events.forEach(event => {
        calendar.events.insert({
            calendarId: calendarId,
            resource: event,
            }, 
            function(err, event) {
            if (err) {
            res.status(400).json('Unable to insert event into weekly planner gcal: ' + err)
            return;
            }
        });
        })
        res.json("Successfully updated events in gcal")
    }
    
    const deleteCalendar = (calendarId) => {
        calendar.calendars.delete({
        calendarId: calendarId
        },
        (err, event) => {
        if (err) {
            res.status(400).json('Unable to delete weekly planner calendar from gcal: ' + err);
            return;
        }
        insertCalendar();
        });
    }

    getWpcalId();
}

module.exports = {
    handleSavetogcal: handleSavetogcal
}