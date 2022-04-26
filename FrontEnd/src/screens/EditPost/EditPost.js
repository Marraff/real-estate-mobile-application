import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'

import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import IpAddress from "../../components/IpAddress";


const EditPost = ({route}) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const post_id = route.params.post_id;
    const navigation = useNavigation();
    
    const changePost = async () => {
        if (title.length>0 && text.length>0){
			const token = await AsyncStorage.getItem('LOGIN_TOKEN');
            fetch(`http://${IpAddress}:8000/changePost`,{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json',
					'auth' : token,
                    },
                    body: JSON.stringify({
                        "title": title,
                        "text": text,
                        "post_id": post_id
                    })
            })
            .then((response)=> {
                if (response.status == 200 ){
                    console.log("Post changed in database");
                    navigation.navigate('Profile');
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    }

    return(
        <ScrollView style={{backgroundColor: '#444444'}}>
            <View style={styles.root}>
                <Text style={styles.title}> Change Post</Text>
                <CustomInput placeholder="title" value = {title} setValue = {setTitle} />
                <CustomInput placeholder="text"  value = {text} setValue = {setText} />
                <CustomButton text= "Change" onPress={changePost}></CustomButton>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#444444',

    },
    logo: {
        maxWidth: 380,
        width: '70%',
        maxHeight: 200,
    },
    title:{
		fontFamily: 'Roboto',
    	fontSize: 25,
    	padding: 20,
    	fontWeight: 'bold',
    	color: '#3B71F7' , 
     },
     text: {
        color: 'white' ,
        marginVertical: 10,
     },
     link:{
        color: '#FDB075' ,
     },
})

export default EditPost;
