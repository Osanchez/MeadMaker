import React, { useContext, useEffect, useState } from 'react';
import { View, Animated, Pressable, Text, ScrollView, Modal } from "react-native";
import { Swipeable, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { deleteValueFor, loadAllMeads } from "../../utils/storageUtils";
import { router, useFocusEffect } from 'expo-router';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { StatusBar } from 'expo-status-bar';
import { TextSizeContext } from '../../contexts/TextSizeContext';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const MyMeads = () => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [searchFilter, setSearchFilter] = useState('name');
    const [searchText, setSearchText] = useState('');

    const [meads, setMeads] = useState([]);
    const [filteredMeads, setFilteredMeads] = useState([]); 

    // load all meads when component is focused
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    useEffect(() => {
        filterMeads();
    }, [searchText, searchFilter]);

    const fetchData = async () => {
        const allMeads = await loadAllMeads();
        setMeads(allMeads);
        setFilteredMeads(allMeads);
    };

    const deleteMead = async (meadId) => {
        await deleteValueFor(meadId);
        const allMeads = await loadAllMeads();
        setMeads(allMeads);
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragAnimatedValue: Animated.AnimatedInterpolation<number>,
        meadId: string
      ) => {
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
                <TouchableOpacity onPress={() => deleteMead(meadId)}>
                    <Text style={globalStyles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                </Animated.View>
            </View>
        );
      };
    
    const filterMeads = async () => {
        if (searchText === '') {
            setFilteredMeads(meads);
        } else {
            // filter meads based on search filter and search text but do not mutate the original meads array
            const filteredMeads = [...meads].filter((mead) => {
                if (searchFilter === 'name') {
                    return mead.name.toLowerCase().startsWith(searchText.toLowerCase());
                } else {
                    return mead.tags.some((tag) => tag.toLowerCase().startsWith(searchText.toLowerCase()));
                }
            });
            setFilteredMeads(filteredMeads);
        }
    }
    
    return ( 
        <ScrollView style={globalStyles.backgroundColor}>
            <StatusBar style={theme.statusBarStyle} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => {
                    setFilterModalVisible(!filterModalVisible);
                }}>
                <SafeAreaView>
                    <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.containerRowSpaceBetween}>
                            <Text style={globalStyles.label}>Search Filter</Text>
                            <Pressable
                                style={globalStyles.inlineButtonStyle}
                                onPress={() => setFilterModalVisible(false)}> 
                                <Text style={globalStyles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                        <Pressable
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8},
                                searchFilter === 'name' && {backgroundColor: theme.selectedHoneyColor}
                            ]}
                            onPress={() => setSearchFilter("name")}> 
                            <Text style={globalStyles.buttonText}>Name</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8},
                                searchFilter === 'tags' && {backgroundColor: theme.selectedHoneyColor}
                            ]}
                            onPress={() => setSearchFilter("tags")}> 
                            <Text style={globalStyles.buttonText}>Tags</Text>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
            <View style={globalStyles.searchBarRow}>
            <TextInput
                style={globalStyles.searchBar}
                value={searchText}
                onChangeText={setSearchText}
                placeholder='Search'/>
            <Pressable
                onPress={() => setFilterModalVisible(true)}>
                <FontAwesome5 name="filter" size={24} color={theme.color} />
            </Pressable>
            </View>
            
            {filteredMeads?.length > 0 ? (
                filteredMeads?.map((mead, index) => (
                    <Swipeable key={mead.id} renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, mead.id)}>
                        <Pressable 
                            onPress={() => 
                                router.push({
                                    pathname: '/meads/[id]',
                                    params: { id: mead.id },
                                })
                            }
                            style={({ pressed }) => [
                                globalStyles.buttonStyle,
                                pressed && {opacity: 0.8}
                            ]}>
                            <Text style={globalStyles.buttonText}>{mead.name}</Text>
                        </Pressable>
                    </Swipeable>
                ))
            ) : (
                <></>
            )}
        </ScrollView>
    );
};

export default MyMeads;