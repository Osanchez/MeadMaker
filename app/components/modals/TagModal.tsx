import React, { useContext, useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { getGlobalStyles } from '../../../styles/globalStyles';
import { SelectedThemeContext } from '../../../contexts/SelectedThemeContext';
import { updateMead } from '../../../utils/storageUtils';
import { TextSizeContext } from '../../../contexts/TextSizeContext';

const TagModal = ({ meadDetails, setMeadDetails, tagModalVisible, setTagModalVisible }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);
    const [tags, setTags] = useState([]); 
    const [tag, setTag] = useState('');

    const [isFormValid, setIsFormValid] = useState(false); 
    const [errors, setErrors] = useState({}); 

    useEffect(() => {
        setTags(meadDetails["tags"]);
    }, [meadDetails]);

    useEffect(() => {
        validateForm();
    }, [tag]);

    const validateForm = () => { 
        let errors = {}; 
        //check if tag is empty
        if (tag.trim() === '') { 
            errors["value"] = 'Please enter a tag.'; 
        }
        //check if tag is already contained in tags, regardless of case
        if (tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
            errors["value"] = 'Tag already exists.';
        }
        
        // Set the errors and update form validity 
        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    };


    const onTagAdd = async () => {
        // check form validity
        if (!isFormValid) { 
            if (errors["value"] !== undefined) {
                alert(errors["value"]);
            } 
            return;
        }

        // update tags
        const updatedTags = [...tags, tag];
        setTags(updatedTags);

        //update meadDetails
        meadDetails["tags"] = updatedTags;

        // update mead in storage
        await updateMead(meadDetails["id"], meadDetails);
        setMeadDetails(meadDetails);

        //reset inputs
        setTag('');

        // close modal
        setTagModalVisible(false);
    }

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={tagModalVisible}
            onRequestClose={() => {
                setTagModalVisible(false);
            }}>
                <SafeAreaView>
                    <ScrollView style={globalStyles.modalViewDefaultBar} automaticallyAdjustKeyboardInsets={true}>
                        <View style={globalStyles.containerRowSpaceBetween}>
                            <Text style={globalStyles.label}>Add Tag</Text>
                            <Pressable
                                style={globalStyles.inlineButtonStyle}
                                onPress={() => setTagModalVisible(!tagModalVisible)}>
                                <Text style={globalStyles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                        <Text style={globalStyles.fieldLabel}>Tag:</Text>
                        <TextInput
                            value={tag}
                            onChangeText={setTag}
                            style={globalStyles.input}
                        />
                        <Pressable 
                        style={({ pressed }) => [
                            globalStyles.buttonStyle,
                            pressed && {opacity: 0.8}
                        ]}
                        onPress={onTagAdd}>
                            <Text style={globalStyles.buttonText}>Add Tag</Text>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
        </Modal>
  );
};

export default TagModal;