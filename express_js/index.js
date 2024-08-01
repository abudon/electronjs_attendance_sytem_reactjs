///////////// IMPORTS ///////////////////
require('dotenv').config({
    path: '../.env'
})
const express = require('express');
const cors = require('cors');
const ZKLib = require('qr-zklib')
const {child, ref, get, set, push } = require('firebase/database')
const {initializeApp} = require('firebase/app')
const {getDatabase} = require('firebase/database')
const {Expo} = require('expo-server-sdk')

///////////// VARIABLES AND INITIALIZING ///////////////////

const app = express()
const bulksmsUrl = process.env.BULKSMS_API_URL
const expo = new Expo()
let zkInstance = new ZKLib("192.168.1.201", 4370, 5000, 5000, "tcp");
const port = process.env.NODE_ENV === 'production' ?8000: process.env.PORT;

// firebase configurations
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}
const firebaseAuth = initializeApp(firebaseConfig)
const database = getDatabase(firebaseAuth)
/// set of individual person
const processedData = new Set()
/// hours of the days
const hour = new Date().getHours()
let message = ''
const intervalMs = 30000; // 60 seconds
const clearLogsIntervalMs = 10 * 60 * 1000; // 10 minutes in milliseconds


///////////// FUNCTIONS ///////////////////

//// Get User from Database

const getUsers = async (userId) => {
    try {
        const databaseReference = ref(database)
        const snapshot = await get(child(databaseReference, `users/${userId}`));
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return {
                name: userData.lastName + " " + userData.firstName,
                phoneNumber1: userData.emergencyContact,
                phoneNumber2:userData.contact,
                type : userData.type,
                parentName: userData.parentName,

            };
        } else {
            console.log("not data found")
            throw new Error("User not found in the database");

        }

    }catch (e) {
        console.error(e);
        throw e;
    }
}


/// SMS Functions
const sendSMS = (time, name, phoneNumber1, phoneNumber2, parentName)=>{
    const formattedTime = time.toLocaleDateString('default',{year: "numeric",
                                                                                                        month: "short",
                                                                                                        day: "numeric",
                                                                                                        hour: "numeric",
                                                                                                        minute: "numeric",
                                                                                                        second: "2-digit"});
    message = (hour <= 9)? `Hello ${parentName}, We are pleased to inform 
    you that your child, ${name}, has successfully checked in at ${formattedTime},
          Thank you for choosing FORTVILLE ACADEMY. Have a great day!` : (hour > 9 && hour < 12) ?
        `Hello ${parentName}, ${name} has stepped out for break, leaving or entering the premises at ${formattedTime} `:
        `Hello ${parentName}, Your child, ${name}, has checked out at ${formattedTime},.
         We hope they had a wonderful day at FORTVILLE ACADEMY.
         Please let us know if you have any questions or concerns. Have a fantastic day!`;



    const requestBody = {
        body: message,
        from: "FortVille Academy",
        to: phoneNumber1+","+phoneNumber2,
        api_token: process.env.BULKSMS_API_TOKEN,
        gateway: "direct-refund"
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    fetch(bulksmsUrl, requestOptions)
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

}

const sendAttendanceRecords = async (data, time, userId) => {
    const userInfo = await data;
    const formattedTime = new Date(time).toISOString().replace(/:/g, '_');
    let check = '';
    check = (hour <= 9)? 'Check-In':(hour>9 && hour<12)?"Break Time (In/Out)":"Check-Out"
    const sendParameters = {
        name: userInfo.name,
        type: userInfo.type,
        time: time,
        check: check,
        contact: userInfo.phoneNumber1,
        registrarId: userId
    }
    const notificationReference = ref(database,`notifications/${formattedTime}`)
    await set(notificationReference,sendParameters)
}

const sendAppMessage =
    async (time, name, parentName, userId) => {
    try {

        const formattedTime = time.toLocaleDateString('default', {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "2-digit"
        });

        message = (hour <= 9) ? `Hello ${parentName}, We are pleased to inform 
    you that your child, ${name}, has successfully checked in at ${formattedTime},
          Thank you for choosing FORTVILLE ACADEMY. Have a great day!` : (hour > 9 && hour < 12) ?
            `Hello ${parentName}, ${name} has stepped out for break, leaving or entering the premise at ${formattedTime} ` :
            `Hello ${parentName}, Your child, ${name}, has checked out at ${formattedTime},.
         We hope they had a wonderful day at FORTVILLE ACADEMY.
         Please let us know if you have any questions or concerns. Have a fantastic day!`;

        const appMessageReference = ref(database, `messages/${userId}`)
        const updateUserMessageReference = push(appMessageReference)
        const messageData = {
            text: message,
            timestamp: Date.now()
        }
        await set(updateUserMessageReference, messageData)

    }catch (e) {
        console.error("Error sending message:", e);
        throw e;
    }
}

const sendToExpo = (token, message) => {
    const pushTokens = token;
    const messages = []

    for (let pushToken of pushTokens){
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            to: pushToken,
            sound: 'default',
            body: message,
            data: { withSome: 'data' },
        })
    }
    const chunks = expo.chunkPushNotifications(messages);
    (async () => {
        for (let chunk of chunks){
            try {
                const receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
}

const sendAppNotification = async (userId, name) => {
    message = `${name} has made an entry on Fortville Attendance System`;
    const userDevicesReference = ref(database, 'usersDevices');
    const snapshot = await get(child(userDevicesReference, `${userId.toLowerCase()}/devices`));
    if (snapshot.exists()) {
        const devicePushTokens = [];
        snapshot.forEach((childSnapshot) => {
            const token = childSnapshot.val().token;
            devicePushTokens.push(token);
        });
        sendToExpo(devicePushTokens, message);
    } else {
        console.error('No device tokens found for user:', userId);
    }
};

const findSuperUser = async () => {
    try {
        const snapshot = await get(ref(database, 'usersDevices'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            const userIds = Object.keys(data);
            const findAdmins = userIds.filter(id => id.length > 9);
            return findAdmins;
        } else {
            console.error('No data found');
            return [];
        }
    } catch (e) {
        console.error('Error fetching data from Firebase:', e);
        throw e;
    }
};

const processedAttendanceRecords = async ()=>{
    try {
        await zkInstance.createSocket();
        const attendanceData = (await zkInstance.getAttendances()).data
        for (const record of attendanceData){
            if (!processedData.has(record.deviceUserId)){
                const time = record.recordTime;
                const data = await getUsers(record.deviceUserId).then((userData)=>{
                    return userData
                }).catch((e)=>console.error(e))
                console.log(
                    time, data.name, data.phoneNumber1,
                    data.phoneNumber2
                )
                if (data.type === 'student'){
                   sendSMS(time, data.name, data.phoneNumber1, data.phoneNumber2, data.parentName)
                   await sendAppMessage(time, data.name, data.parentName, record.deviceUserId)
                    await sendAppNotification(record.deviceUserId, data.name)
                }else if (data.type === 'staff'){
                    await sendAppNotification(record.deviceUserId, data.name)
                    const admins = await findSuperUser()
                    if (admins){
                        for (let admin of admins){
                            await sendAppNotification(admin, data.name)
                        }
                    }
                }
                await sendAttendanceRecords(data, time, record.deviceUserId)
                processedData.add(record.deviceUserId);
            }
        }
    }catch (e) {
        console.error(e)
    }
}

const clearDeviceLog = async () =>{
    await zkInstance.clearAttendanceLog()
}
const clearProcessedData = ()=>{
    processedData.clear()
}


///////////// CALLS AND LISTENERS ///////////////////

setInterval(processedAttendanceRecords, intervalMs);
setInterval(clearDeviceLog, clearLogsIntervalMs);
setInterval(clearProcessedData, clearLogsIntervalMs);

app.use(cors());
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express.js server!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

///////////// EXPORTS ///////////////////
module.exports = app
