import React from "react";
import {View, Text, TextInput, StyleSheet, Pressable} from "react-native";

const CustomButton = ({onPress, text, type = "PRIMARY"}) => {

    return(
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`container_${type}`]]}>{text}</Text>
            
        </Pressable>
    );
};

const styles = StyleSheet.create({
   
    text: {
        fontWeight: 'bold',
        color: 'white',
        
    },
    container:{
         
        width: '100%',

        borderWidth: 1,
        borderRadius: 5,

        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
    },
    container_PRIMARY:{
        backgroundColor: '#3B71F7',
    },
    container_TERTIERY:{

    }
})

export default CustomButton;