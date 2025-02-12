import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export async function deleteAllUserData() {
    //get user meads
    const userMeadsJson = await SecureStore.getItemAsync('userMeads');
    const userMeads = userMeadsJson ? JSON.parse(userMeadsJson) : [];

    // itterate all meads and delete all associated events
    for (const meadId of userMeads) {
        const meadDataJson = await SecureStore.getItemAsync(meadId);
        const meadData = meadDataJson ? JSON.parse(meadDataJson) : {};
        if (meadData.events) {
            for (const eventId of meadData.events) {
                await SecureStore.deleteItemAsync(eventId);
            }
        }
        await SecureStore.deleteItemAsync(meadId);
    }   

    // delete all user meads
    await SecureStore.deleteItemAsync('userMeads');

    // delete all user settings
    await SecureStore.deleteItemAsync('lastUpdated');
    await SecureStore.deleteItemAsync('appTheme');
    await SecureStore.deleteItemAsync('fontSize');

    alert("All user data deleted.");
}

export async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export async function deleteValueFor(key) {
    //delete the events attached to the mead
    const meadDataJson = await SecureStore.getItemAsync(key);
    const meadData = meadDataJson ? JSON.parse(meadDataJson) : {};
    if (meadData.events) {
        for (const eventId of meadData.events) {
            await SecureStore.deleteItemAsync(eventId);
        }
    }
    
    // delete the mead data
    await SecureStore.deleteItemAsync(key);

    // delete the mead from the userMeads array
    const existingUserMeadsJson = await SecureStore.getItemAsync('userMeads');
    let existingUserMeads = existingUserMeadsJson ? JSON.parse(existingUserMeadsJson) : [];
    const index = existingUserMeads.findIndex(meadId => meadId === key);
    existingUserMeads.splice(index, 1);
    await save('userMeads', JSON.stringify(existingUserMeads));
}

export async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
}

export async function ensurePredefinedData() {

    // update predefined data
    try {
        const predefinedData = await require('../assets/data/meadStyles.json');
        const predefinedDataMeads = predefinedData.styles;
        // for every mead style in predefinedData, add it to secure storage
        for (const [key, value] of Object.entries(predefinedDataMeads)) {
            await SecureStore.setItemAsync(key, JSON.stringify(value));
        }
        // now update the list of all known defined stylesr
        await SecureStore.setItemAsync('meadStyles', JSON.stringify(Object.keys(predefinedDataMeads)));

        // and update the lastUpdated timestamp
        await SecureStore.setItemAsync('lastUpdated', predefinedData.timestamp);
    } catch (error) {
        alert('Error loading app data:' + error);
    }

    // set default app theme
    const appTheme = await SecureStore.getItemAsync('appTheme');
    if (!appTheme)  {
        await SecureStore.setItemAsync('appTheme', 'system');
    }

    // set default text size
    const textSize = await SecureStore.getItemAsync('fontSize');
    if (!textSize)  {
        await SecureStore.setItemAsync('fontSize', 'default');
    }
}
        
export async function createMead(meadData) {
    // generate UUID4 for mead
    const meadId = uuidv4();
    meadData.id = meadId;

    // Save the mead data
    await SecureStore.setItemAsync(meadId, JSON.stringify(meadData));

    // Update the userMeads array
    const existingUserMeadsJson = await SecureStore.getItemAsync('userMeads');
    const existingUserMeads = existingUserMeadsJson ? JSON.parse(existingUserMeadsJson) : [];
    existingUserMeads.push(meadId);
    await SecureStore.setItemAsync('userMeads', JSON.stringify(existingUserMeads));

    return meadId;
}


export async function loadMead(meadId: string) {
    const userMeadJson = await SecureStore.getItemAsync(meadId);
    const meadDetails = userMeadJson ? JSON.parse(userMeadJson) : {};
    return meadDetails;
}

export async function updateMead(meadId: string, meadData) {
    // Save the mead data
    await SecureStore.setItemAsync(meadId, JSON.stringify(meadData));
}

export async function duplicateMead(meadId: string) {
    const meadDetails = await loadMead(meadId);
    let duplicateMead = { ...meadDetails };
    duplicateMead.id = uuidv4();
    duplicateMead.name = duplicateMead.name + ' (copy)';
    duplicateMead.events = [];

    // Save the mead data
    await SecureStore.setItemAsync(duplicateMead.id, JSON.stringify(duplicateMead));

    // Update the userMeads array
    const existingUserMeadsJson = await SecureStore.getItemAsync('userMeads');
    const existingUserMeads = existingUserMeadsJson ? JSON.parse(existingUserMeadsJson) : [];
    existingUserMeads.push(duplicateMead.id);
    await SecureStore.setItemAsync('userMeads', JSON.stringify(existingUserMeads));

    return duplicateMead.id;
}

export async function loadAllMeads() {
    let meads = [];
    const userMeadsJson = await SecureStore.getItemAsync('userMeads');
    const userMeads = userMeadsJson ? JSON.parse(userMeadsJson) : [];

    for (const meadId of userMeads) {
        const meadJson = await SecureStore.getItemAsync(meadId);
        const mead = meadJson ? JSON.parse(meadJson) : {};
        if (mead && Object.keys(mead).length > 0) {
            meads.push(mead);
        }
    }
    return meads;
}

export async function createEvent(meadID, eventData) {
    // generate UUID4 for mead
    const eventId = uuidv4();
    eventData.id = eventId;

    // Save the event data
    await SecureStore.setItemAsync(eventId, JSON.stringify(eventData));

    // update the mead data with event UUID
    const meadDataJson = await SecureStore.getItemAsync(meadID);
    const meadData = meadDataJson ? JSON.parse(meadDataJson) : {};

    if (!meadData.events) {
        meadData.events = [];
    } 

    meadData.events.push(eventId);
    await SecureStore.setItemAsync(meadID, JSON.stringify(meadData));
    return eventId;

}

export async function loadEvent(eventId: string) {
    const eventJson = await SecureStore.getItemAsync(eventId);
    const eventDetails = eventJson ? JSON.parse(eventJson) : {};
    return eventDetails;
}

export async function updateEvent(eventId: string, eventData) {
    // Save the event data
    await SecureStore.setItemAsync(eventId, JSON.stringify(eventData));
}

export async function deleteEvent(meadId: string, eventId: string) {
    // delete the event data
    await SecureStore.deleteItemAsync(eventId);

    // delete the event from the mead events array
    const meadDataJson = await SecureStore.getItemAsync(meadId);
    let meadData = meadDataJson ? JSON.parse(meadDataJson) : {};
    const index = meadData.events.findIndex(event => event === eventId);
    meadData.events.splice(index, 1);
    await SecureStore.setItemAsync(meadId, JSON.stringify(meadData));
}

export async function loadAllEvents(eventIds: string[]) {
    const events = [];
    for (const eventId of eventIds) {
        const eventDataJson = await SecureStore.getItemAsync(eventId);
        const eventData = eventDataJson ? JSON.parse(eventDataJson) : {};
        if (eventData) {
            events.push(eventData);
        }
    }
    return events;
}

export async function loadAllMeadStyles() {
    const userMeadsJson = await SecureStore.getItemAsync('meadStyles');
    const userMeads = userMeadsJson ? JSON.parse(userMeadsJson) : [];

    return userMeads;
}