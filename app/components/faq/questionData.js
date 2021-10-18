export const questionData = {
  general: [
    {
      questionId: "view-list-participants",
      questionText: "Can I view a list of Capco Global Challenge participants?",
      answerText:
        "You can view a list of Challenge participants, and the teams that have been created <a href='/'>here</a>.",
    },
    {
      questionId: "participate-when-restricted-activity",
      questionText:
        "Can I participate if I am restricted by COVID-19 rules on outdoor exercise?",
      answerText:
        "Yes, if you have any form of indoor trainer (bike, running machine, rower etc) you can use that and enter your activity on the app (Strava/Fitbit) manually. <br /><br /> Alternatively, if you do not have access to an indoor trainer then you can complete indoor workouts (circuits, yoga etc) and enter your activity on your selected app (Strava/Fitbit) manually – please select either Workout/Circuit/ Yoga as applicable. See the table below for a guide on the ‘distance’ that will be attributed to the selected exercise based on duration. <br /> <br /> <span style='color: #fc4c02;font-weight: bold'> Strava Activity Name </span>/<span style='color: #00b3bc;font-weight: bold'> Fitbit Activity Name </span> <br /> <table>  <tr>	<style>      table,      th,      td {        padding: 10px;        border: 1px solid white;        border-collapse: collapse;      }    </style>    <th>Time (Minutes)</th>    <th> <span style='color: #fc4c02'> Workout </span>/ <span style='color: #00b3bc'>Circuit </span>		(160 conversion factor)	</th>    <th><span style='color: #fc4c02'> Yoga </span> / <span style='color: #00b3bc'>Yoga </span>	(20 conversion factor)	</th>  </tr>  <tr>    <td>5</td>    <td>800 meters</td>    <td>100 meters</td>  </tr>	<tr>    <td>10</td>    <td>1600 meters</td>    <td>200 meters</td>  </tr><tr>    <td>15</td>    <td>2400 meters</td>    <td>300 meters</td>  </tr><tr>    <td>30</td>    <td>4800 meters</td>    <td>600 meters</td>  </tr><tr>    <td>45</td>    <td>7200 meters</td>    <td>900 meters</td>  </tr></table>",
    },
  ],
  trackingActivity: [
    {
      questionId: "how-to-track-my-activity",
      questionText: "How can I track my activity?",
      answerText:
        'You can track your activity using the following apps: <ul><li>Fitbit App (<a href="https://apps.apple.com/us/app/fitbit-health-fitness/id462638897">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.fitbit.FitbitMobile&hl=en_GB&gl=US"> Android</a>)</li><li>Strava App (<a href="https://apps.apple.com/us/app/strava-run-ride-swim/id426826309">iOS</a> or <a href="https://play.google.com/store/apps/details?id=com.strava&hl=en_GB&gl=US"> Android</a>)</li></ul>',
    },
    {
      questionId: "tracking-with-smart-watch",
      questionText: "How can I track my activity?",
      answerText:
        'If you are using a smart watch to track your activity, you will need to set-up the Strava or Fitbit app on your watch and then link your Strava/Fitbit account to sync with the Challenge. For more information, visit the ‘How To’ page <a href="/how-to">here</a>.',
    },
    {
      questionId: "tracking-with-mobile-phone",
      questionText: "How can I track my activity?",
      answerText:
        'If you wish to use a smart phone (not all phones are supported) to track your activity, you can do so using the Fitbit app. For more information, you can access a Fitbit Mobile Track how-to guide <a href="/how-to">here</a>.',
    },
    {
      questionId: "do-i-need-a-wearable",
      questionText: "Do I need to use a wearable device?",
      answerText:
        'If you do not have a wearable device, then you can enter your manually tracked data into the Strava or Fitbit app or on your desktop and link to the Capco Global Challenge app.',
    },
    {
      questionId: "upload-data-to-challenge",
      questionText: "How do I upload my activity data to the Capco Global Challenge app?",
      answerText:
        'You can upload your activity data from Strava or Fitbit by linking your account to the Capco Global Challenge app. Once you have linked your account you can either track your activity and sync your smart device or manually input activity into Strava/Fitbit. More information is available on the ‘How To’ page <a href="/how-to">here</a>.',
    },
    {
      questionId: "cycling-distance-conversion",
      questionText: "How will cycling distances be recorded?",
      answerText:
        'Cycling distances will be converted using a ratio of 3:1 throughout the Challenge to allow comparable participation across walkers, runners, rowers and cyclists. This is one of the broadly accepted conversion ratios.',
    },
  ],
  team: [
    {
      questionId: "how-to-join-a-team",
      questionText: "How do I join or set-up a team?",
      answerText:
        "When you click to register, you can select ‘Teams’ in the top right-hand corner and have the option to create or join a team. <a href='/teams/register'>Or click here after registering</a>!",
    },
    {
      questionId: "how-to-leave-a-team",
      questionText: "How do I leave a team?",
      answerText:
        "Use the unique link which you will have received in your email from the Challenge Team Support when you were registered for the team. You can then join another team if you wish.",
    },
  ],
  data: [
    {
      questionId: "is-my-data-syncing",
      questionText: "How can I check that my data is syncing?",
      answerText:
        "We would advise you to open and refresh your selected app (Strava/Fitbit) daily to ensure the data is syncing. ",
    },
    {
      questionId: "why-is-my-data-not-syncing",
      questionText:
        "Why is my data not syncing with the Capco Global Challenge application?",
      answerText:
        "Please confirm that you have registered correctly by trying to register again. If this does not work, please open and refresh your app (Strava/Fitbit) and allow one hour for the data to sync. We also recommend opening your app daily throughout the Challenge to allow the data to sync. If this still does not work, please contact <a href='mailto:3cd19d49.capco.com@apac.teams.ms'>Challenge Team Support</a> for further assistance.",
    },
    {
      questionId: "will-you-see-my-location",
      questionText: "Will Capco be able to view my location through the app?",
      answerText:
        "No, Capco does not retrieve, store or process your GPS data if available from Strava/Fitbit, therefore Capco cannot see your location.",
    },
    {
      questionId: "will-you-share-my-data",
      questionText: "Will you share my data?",
      answerText: "No, Capco will never share your data.",
    },
    {
      questionId: "how-will-you-store-my-data",
      questionText: "How long will you store my data?",
      answerText:
        "Your data will be stored for the duration of the Capco Global Challenge, plus a further 30 days. Following this date all personally identifying data will be deleted.",
    },
  ],
};
