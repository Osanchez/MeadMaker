import React, { useState, useEffect, useContext, useRef } from 'react';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { loadAllEvents, loadMead, updateMead } from "../../../utils/storageUtils";
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {SwipeableMethods}  from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Dimensions } from 'react-native';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
  } from 'react-native-reanimated';  
  import { FontAwesome5 } from '@expo/vector-icons'; 
import { getGlobalStyles } from '../../../styles/globalStyles';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import EventModal from '../../components/modals/EventModal';
import RecipeModal from '../../components/modals/RecipeModal';
import TagModal from '../../components/modals/TagModal';
import { TextSizeContext } from '../../../contexts/TextSizeContext';
import InformationModal from '../../components/modals/InformationModal';
import ActionModal from '../../components/modals/ActionModal';
import { ActionModalContext } from '../../../contexts/ActionModalContext';

const MeadPage = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [recipeModalVisible, setRecipeModalVisible] = useState(false);
    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [informationModalVisible, setInformationModalVisible] = useState(false);
    const {actionModalVisible, setActionModalVisible} = useContext(ActionModalContext);

    const { id } = useLocalSearchParams<{ id: string }>();
    const [meadDetails, setMeadDetails] = useState({});
    const [meadEvents, setMeadEvents] = useState([]); 
    const [extraInfo, setExtraInfo] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const swipeableRefs = useRef(new Map());  // Stores refs for each event

    const screenWidth = Dimensions.get('window').width;

    // load all meads when component is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchMeadDetails();
        }, [id])
    );

    useEffect(() => {
        fetchEventDetails();
    }, [meadDetails]);

    // reload mead info when event is added
    const fetchMeadDetails = async () => {
        try {
            const data = await loadMead(id);
            setMeadDetails(data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    // get event details
    const fetchEventDetails = async () => {
        try {
            if (meadDetails && meadDetails["events"]) {
                const eventData = await loadAllEvents(meadDetails["events"])
                setMeadEvents(eventData);
            }
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const localizedDate = (dateStr) => {
        const dateStarted = new Date(dateStr);
        const localizedDate = dateStarted.toLocaleDateString();
        return localizedDate
    };

    const onDeleteIngredient = async (index) => {
        const newRecipe = [...meadDetails["recipe"]];
        newRecipe.splice(index, 1);
        meadDetails["recipe"] = newRecipe;
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);
        fetchMeadDetails();
    }

    const onDeleteTag = async (index) => {
        const newTags = [...meadDetails["tags"]];
        newTags.splice(index, 1);
        meadDetails["tags"] = newTags;
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);
        fetchMeadDetails();
    }

    const onDeleteEvent = async (index) => {
        const newEvents = [...meadDetails["events"]];
        newEvents.splice(index, 1);
        meadDetails["events"] = newEvents;
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);
        fetchMeadDetails();
    }

    const deleteIngredient = (index) => {
        onDeleteIngredient(index)
        swipeableRefs.current.get(index)?.close();
    }

    const deleteTag = (index) => {
        onDeleteTag(index)
        swipeableRefs.current.get(index)?.close();
    }

    const deleteEvent = (index) => {
        onDeleteEvent(index)
        swipeableRefs.current.get(index)?.close();
    }

    const onEventLongPress = (event) => {
        const eventInfo = {
            "Date": localizedDate(event.date),
            "Type": event.type,
            "Value": event.value
        }
        setExtraInfo(eventInfo);
        setInformationModalVisible(true);
    }

    const renderRightAction = (
        prog: SharedValue<number>,
        drag: SharedValue<number>) => {
            const styleAnimation = useAnimatedStyle(() => {
                return {
                    backgroundColor: 'red',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: screenWidth,
                    transform: [{ translateX: drag.value + screenWidth }],
                };
            });

            return (
                <Reanimated.View style={[styleAnimation]}>
                    <Text style={globalStyles.swipeDeleteLabel}>Delete</Text>
                    <FontAwesome5 name="trash" size={25} color={theme.color} />
                </Reanimated.View>
            );
      }


    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error loading data: {error.message}</Text>;
    }

    return ( 
        <ScrollView style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <EventModal
                meadDetails={meadDetails}
                setMeadDetails={setMeadDetails}
                eventModalVisible={eventModalVisible}
                setEventModalVisible={setEventModalVisible}
            />
            <RecipeModal
                meadDetails={meadDetails}
                setMeadDetails={setMeadDetails}
                recipeModalVisible={recipeModalVisible}
                setRecipeModalVisible={setRecipeModalVisible}
            />
            <TagModal
                meadDetails={meadDetails}
                setMeadDetails={setMeadDetails}
                tagModalVisible={tagModalVisible}
                setTagModalVisible={setTagModalVisible}
            />
            <InformationModal
                information={extraInfo}
                modalVisible={informationModalVisible}
                setModalVisible={setInformationModalVisible}
            />
            <ActionModal
                meadDetails={meadDetails}
                setMeadDetails={setMeadDetails}
                actionModalVisible={actionModalVisible}
                setActionModalVisible={setActionModalVisible}
            />
            <View style={globalStyles.headerContainer}>
                <Text style={globalStyles.header}>{meadDetails["name"]}</Text>
            </View>
            <Reanimated.View style={globalStyles.bodyContainer}>
                <View style={globalStyles.bodyContainerRow}>
                    <Text style={globalStyles.label}>Started:</Text>
                    <Text style={globalStyles.bodyText}>{localizedDate(meadDetails["dateStarted"])}</Text>
                </View>
                <View style={globalStyles.bodyContainerRow}>
                    <Text style={globalStyles.label}>Description:</Text>
                    <Text style={globalStyles.bodyText}>{meadDetails["description"]}</Text>
                </View>
                <Reanimated.View style={globalStyles.bodyContainerRow}>
                    <Reanimated.View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Recipe:</Text>
                        <Pressable
                            onPress={() => setRecipeModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Ingredient</Text>
                        </Pressable>
                    </Reanimated.View>
                    {meadDetails?.recipe?.map((ingredient, index) =>
                        <GestureHandlerRootView key={ingredient.name+ingredient.metric+ingredient.amount+index} style={globalStyles.smallSpacing}>
                            <ReanimatedSwipeable 
                                ref={(ref) => {
                                    if (ref) swipeableRefs.current.set(index, ref);
                                }}
                                containerStyle={globalStyles.shaded}
                                friction={1} 
                                enableTrackpadTwoFingerGesture 
                                onSwipeableOpen={() => deleteIngredient(index)}
                                renderRightActions={(progress, dragX) => renderRightAction(progress, dragX)}
                                >
                                <Reanimated.View key={index} style={globalStyles.containerRowSpaceBetween}>
                                    <Text style={globalStyles.boldedValue}>{ingredient.name}</Text>
                                    <Text style={globalStyles.value}>{ingredient.amount} {ingredient.metric}</Text>
                                </Reanimated.View>
                            </ReanimatedSwipeable>
                        </GestureHandlerRootView>
                    )}
                </Reanimated.View>
                <Reanimated.View style={globalStyles.bodyContainerRow}>
                    <Reanimated.View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Tags:</Text>
                        <Pressable
                            onPress={() => setTagModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Tag</Text>
                        </Pressable>
                    </Reanimated.View>
                    {meadDetails?.tags?.map((tag, index) =>
                        <GestureHandlerRootView style={globalStyles.smallSpacing} key={tag+index}>
                            <ReanimatedSwipeable
                                ref={(ref) => {
                                    if (ref) swipeableRefs.current.set(index, ref);
                                }}
                                containerStyle={globalStyles.shaded}
                                friction={1} 
                                enableTrackpadTwoFingerGesture 
                                onSwipeableOpen={() => deleteTag(index)}
                                renderRightActions={(progress, dragX) => renderRightAction(progress, dragX)}
                                >
                                <Reanimated.View key={index}>
                                    <Text style={globalStyles.boldedValue}>{tag}</Text>
                                </Reanimated.View>
                            </ReanimatedSwipeable>
                        </GestureHandlerRootView>
                        )
                    }
                </Reanimated.View>
                <Reanimated.View style={globalStyles.bodyContainerRow}>
                    <Reanimated.View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Events:</Text>
                        <Pressable
                            onPress={() => setEventModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Event</Text>
                        </Pressable>
                    </Reanimated.View>
                    {meadEvents?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, index) => (
                            <GestureHandlerRootView key={event.id} style={globalStyles.smallSpacing}>
                                <ReanimatedSwipeable
                                    ref={(ref) => {
                                        if (ref) swipeableRefs.current.set(index, ref);
                                    }}
                                    containerStyle={globalStyles.shaded}
                                    friction={1} 
                                    enableTrackpadTwoFingerGesture 
                                    onSwipeableOpen={() => deleteEvent(index)}
                                    renderRightActions={(progress, dragX) => renderRightAction(progress, dragX)}
                                    >
                                    <Pressable
                                        key={index}
                                        style={({ pressed }) => [
                                            globalStyles.eventContainer, globalStyles.shaded,
                                            pressed && {opacity: 0.8}
                                        ]}
                                        onLongPress={() => onEventLongPress(event)}>
                                        <Reanimated.View style={globalStyles.containerRowSpaceBetween}>
                                            <Text style={globalStyles.boldedValue}>{event.type}</Text>
                                            <Text style={globalStyles.boldedValue}>{localizedDate(event.date)}</Text>
                                        </Reanimated.View>
                                        {event.value.length > 24 ? (
                                            <Text style={globalStyles.value}>
                                                {event.value.substring(0, 24)}...
                                            </Text>
                                        ) : (
                                            <Text style={globalStyles.value}>{event.value}</Text>
                                        )}
                                    </Pressable>
                                </ReanimatedSwipeable>
                            </GestureHandlerRootView>
                        ))}
                </Reanimated.View>
            </Reanimated.View>
        </ScrollView>
    );
};

export default MeadPage;