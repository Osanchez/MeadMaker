import React, { useState, useEffect, useContext } from 'react';
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Animated, Pressable, Text, View, TouchableOpacity } from "react-native";
import { deleteEvent, loadAllEvents, loadMead, updateMead } from "../../../utils/storageUtils";
import { ScrollView, Swipeable } from 'react-native-gesture-handler';
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
        const eventToDelete = meadDetails["events"][index];
        await deleteEvent(meadDetails["id"], eventToDelete);
        const newEvents = [...meadDetails["events"]];
        newEvents.splice(index, 1);
        meadDetails["events"] = newEvents;
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);
        fetchMeadDetails();
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

    const renderIngredientRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>, 
        index: number) => {
            const opacity = dragAnimatedValue.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
                });
                    
            return (
                <View style={globalStyles.swipedRow}>
                    <View style={globalStyles.swipedConfirmationContainer}>
                    <Text style={globalStyles.label}>Are you sure?</Text>
                    </View>
                    <Animated.View style={[globalStyles.deleteButton, {opacity}]}>
                    <TouchableOpacity 
                    onPress={() => {
                        onDeleteIngredient(index)
                    }}>
                        <Text style={globalStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    </Animated.View>
                </View>
            );
      };

    const renderTagRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>, 
        index: number) => {
            const opacity = dragAnimatedValue.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
                });
                    
            return (
                <View style={globalStyles.swipedRow}>
                    <View style={globalStyles.swipedConfirmationContainer}>
                    <Text style={globalStyles.label}>Are you sure?</Text>
                    </View>
                    <Animated.View style={[globalStyles.deleteButton, {opacity}]}>
                    <TouchableOpacity 
                    onPress={() => {
                        onDeleteTag(index)
                    }}>
                        <Text style={globalStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    </Animated.View>
                </View>
            );
      }
    
    const renderEventRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>, 
        index: number) => {
            const opacity = dragAnimatedValue.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
                });
                    
            return (
                <View style={globalStyles.swipedRow}>
                    <View style={globalStyles.swipedConfirmationContainer}>
                    <Text style={globalStyles.label}>Are you sure?</Text>
                    </View>
                    <Animated.View style={[globalStyles.deleteButton, {opacity}]}>
                    <TouchableOpacity 
                    onPress={() => {
                        onDeleteEvent(index)
                    }}>
                        <Text style={globalStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    </Animated.View>
                </View>
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
            <View style={globalStyles.bodyContainer}>
                <View style={globalStyles.bodyContainerRow}>
                    <Text style={globalStyles.label}>Started:</Text>
                    <Text style={globalStyles.bodyText}>{localizedDate(meadDetails["dateStarted"])}</Text>
                </View>
                <View style={globalStyles.bodyContainerRow}>
                    <Text style={globalStyles.label}>Description:</Text>
                    <Text style={globalStyles.bodyText}>{meadDetails["description"]}</Text>
                </View>
                <View style={globalStyles.bodyContainerRow}>
                    <View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Recipe:</Text>
                        <Pressable
                            onPress={() => setRecipeModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Ingredient</Text>
                        </Pressable>
                    </View>
                    {meadDetails?.recipe?.map((ingredient, index) =>
                        <Swipeable key={ingredient.name+ingredient.metric+ingredient.amount} renderRightActions={(progress, dragX) => renderIngredientRightActions(progress, dragX, index)}>
                            <View key={index} style={[globalStyles.containerRowSpaceBetween, globalStyles.smallSpacing, globalStyles.shaded]}>
                                <Text style={globalStyles.value}>{ingredient.name}</Text>
                                <Text style={globalStyles.value}>{ingredient.amount} {ingredient.metric}</Text>
                            </View>
                        </Swipeable>
                    )}
                </View>
                <View style={globalStyles.bodyContainerRow}>
                    <View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Tags:</Text>
                        <Pressable
                            onPress={() => setTagModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Tag</Text>
                        </Pressable>
                    </View>
                    {
                        meadDetails?.tags?.map((tag, index) =>
                        <Swipeable key={tag} renderRightActions={(progress, dragX) => renderTagRightActions(progress, dragX, index)}>
                            <View key={index} style={[globalStyles.tagContainer, globalStyles.shaded, globalStyles.smallSpacing]}>
                                <Text style={globalStyles.value}>{tag}</Text>
                            </View>
                        </Swipeable>
                        )
                    }
                </View>
                <View style={globalStyles.bodyContainerRow}>
                    <View style={[globalStyles.containerRowSpaceBetween]}>
                        <Text style={globalStyles.label}>Events:</Text>
                        <Pressable
                            onPress={() => setEventModalVisible(true)}>
                            <Text style={globalStyles.linkText}>Add Event</Text>
                        </Pressable>
                    </View>
                    {meadEvents?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, index) => (
                            <Swipeable
                                key={event.id}
                                renderRightActions={(progress, dragX) =>
                                    renderEventRightActions(progress, dragX, index)
                                }>
                                <Pressable
                                    key={index}
                                    style={({ pressed }) => [
                                        globalStyles.eventContainer, globalStyles.shaded, globalStyles.smallSpacing,
                                        pressed && {opacity: 0.8}
                                    ]}
                                    onLongPress={() => onEventLongPress(event)}>
                                    <View style={globalStyles.containerRowSpaceBetween}>
                                        <Text style={globalStyles.containerText}>{event.type}</Text>
                                        <Text>{localizedDate(event.date)}</Text>
                                    </View>
                                    {event.value.length > 24 ? (
                                        <Text style={globalStyles.value}>
                                            {event.value.substring(0, 24)}...
                                        </Text>
                                    ) : (
                                        <Text style={globalStyles.value}>{event.value}</Text>
                                    )}
                                </Pressable>
                            </Swipeable>
                        ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default MeadPage;