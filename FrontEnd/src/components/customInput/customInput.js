import React from "react";
import {View, Text, TextInput, StyleSheet, useWindowDimensions} from "react-native";

const customInput = ({value, setValue, placeholder, secureTextEntry}) => {

    return(
        <View style={styles.container}>
            <TextInput 
            	value = {value}
            	onChangeText = {setValue}
            	placeholder={placeholder}
            	style={styles.input}
            	secureTextEntry= {secureTextEntry}
        	/> 
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        maxWidth: 380,
        width: '70%',
        maxHeight: 200,
    },
    container:{
        backgroundColor: '#5e5d5d',
        width: '95%',

        borderColor: '#363535',
        borderWidth: 1.2,
        borderRadius: 5,

        paddingHorizontal: 10,
        marginVertical: 10,
    },
    input:{
		color: '#ebe8e8'
    },
})

export default customInput;
