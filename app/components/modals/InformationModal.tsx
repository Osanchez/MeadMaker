import React, { useContext } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { getGlobalStyles } from '../../styles/globalStyles';
import { SelectedThemeContext } from '../../contexts/SelectedThemeContext';
import { TextSizeContext } from '../../contexts/TextSizeContext';

const InformationModal = ({ information, modalVisible, setModalVisible }) => {
    const {theme, setThemeHandler} = useContext(SelectedThemeContext);
    const {textSize, setTextSizeHandler} = useContext(TextSizeContext);
    const globalStyles = getGlobalStyles(theme, textSize);

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}>
                <SafeAreaView>
                    <ScrollView style={globalStyles.modalViewDefaultBar}>
                        <View style={globalStyles.containerRowSpaceBetween}>
                            <Text style={globalStyles.label}>Information</Text>
                            <Pressable
                                style={globalStyles.inlineButtonStyle}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={globalStyles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                        {Object.keys(information).map((key) => {
                            return (
                                <View key={key} style={globalStyles.smallSpacing}>
                                    <Text style={globalStyles.label}>{key}:</Text>
                                    <Text style={globalStyles.bodyText}>{information[key]}</Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </SafeAreaView>
        </Modal>
  );
};

export default InformationModal;