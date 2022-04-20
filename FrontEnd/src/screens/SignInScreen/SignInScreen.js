import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, Text, Image, StyleSheet, useWindowDimensions, useEffect, ScrollView} from "react-native";

import Logo from "../../../assets/images/logo_name.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";

const SignInScreen = ({navigation}) => {
	const checkAuth = async () => {
		const token = await AsyncStorage.getItem('LOGIN_TOKEN');
		if(token !== null){
			fetch('http://10.0.2.2:8000/logCheck', {
				method: 'PUT',
				headers: {
					'Content-Type':'application/json',
					'auth': token
				},
			})
			.then(response => { 
				if(response.status == 200){
					response.text().then(id => navigation.replace('MainStack', id));
				}
			})
		}
	}
	checkAuth()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {height} = useWindowDimensions();
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
        .then(response => {
            if (response.status == 200){
				response.json().then(data => {
					AsyncStorage.setItem('LOGIN_TOKEN', data.token, () => { navigation.replace('MainStack', data.id)})
				})
			}
			else if(response.status == 400){
				response.text().then(data => console.warn(data))
			}
        })
        .catch((error)=>{
            console.log(error);

        })
    }
    const onSignUpPressed = () => {
        navigation.navigate('Register');
    }

    return(
        <ScrollView style={{backgroundColor: '#444444'}}>
			<View style={styles.root}>
				<Image source={Logo} style={[styles.logo, {height: height * 0.25}]} resizeMode="contain" />
				<CustomInput placeholder='email' value = {email} setValue = {setEmail} style={styles.inputs} />
				<CustomInput placeholder='password' value = {password} setValue = {setPassword} secureTextEntry = {true} />

				<CustomButton text= "Sign in" onPress={onSignPress}></CustomButton>
				<CustomButton text= "Don't have an account? Create one!" onPress={onSignUpPressed}></CustomButton>
				<View></View>
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
	
	inputs: {
		placeholderTextColor: '#444444',
	}
})

export default SignInScreen;
