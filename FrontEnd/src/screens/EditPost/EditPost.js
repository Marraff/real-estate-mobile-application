import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";


import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";



const EditPost = ({route}) => {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const  user_id  = route.params.user_id;
    const  post_id = route.params.post_id;

    console.log(route.params)
    
    const navigation = useNavigation();
    
    const changePost = () => {
        
        if (title.length>0 && text.length>0){
            fetch('http://10.0.2.2:8000/changePost',{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        
                        "title": title,
                        "text": text,

                        "user_id": user_id,
                        "post_id": post_id

                    })
            })
            .then((response)=> {
                if (response.status == 200 ){
                    console.log("Post changed in database");
                    navigation.navigate('Profile',user_id);
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    }

    return(
        <ScrollView>
            <View style={styles.root}>

                <Text style={styles.title}> Change Post</Text>

                <CustomInput 
                    placeholder="title"
                    value = {title}
                    setValue = {setTitle}
                    
                />
                 <CustomInput 
                    placeholder="text"
                    value = {text}
                    setValue = {setText}
                    
                />
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black' ,  
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
