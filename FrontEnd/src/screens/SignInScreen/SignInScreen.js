import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";


import Logo from "../../../assets/images/logo.jpg";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {height} = useWindowDimensions();
    const navigation = useNavigation();
    const onSignPress = () => {
      
        fetch('http://10.0.2.2:8000/login',{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({
                   
                    "email": email ,
                    "password": password
                })
        })
        .then((response) => {
            console.log(response.status)

            if (response.status == 200){

                response.json()
                .then((resposneJson) => {
                    console.log(resposneJson);
                    navigation.navigate('Home',resposneJson);
                })
             }
        })
        .catch((error)=>{
            console.log(error);

        })
    }
    const onSignUpPressed = () => {
        console.warn("Register");
        navigation.navigate('Register');
    }

    return(
        <ScrollView>
            <View style={styles.root}>
                <Image 
                    source={Logo} 
                    style={[styles.logo, {height: height * 0.3}]} 
                    resizeMode="contain" 
                />
                <CustomInput 
                    placeholder="email"
                    value = {email}
                    setValue = {setEmail}
                />
                <CustomInput 
                    placeholder="password"
                    value = {password}
                    setValue = {setPassword}
                    secureTextEntry = {true}
                />
                <CustomButton text= "Sign in" onPress={onSignPress}></CustomButton>
                <CustomButton text= "Don't have an account? Create one!" onPress={onSignUpPressed}></CustomButton>
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
})

export default SignInScreen;