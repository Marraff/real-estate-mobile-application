import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";


import Logo from "../../../assets/images/logo.jpg";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";



const RegisterScreen = () => {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const navigation = useNavigation();
    
    const onSignUpPressed = () => {
        console.warn("registered");
        navigation.navigate('SignIn');
    }
    const onTermsOfUse = () => {
        console.warn('not ready yet');
    }

    return(
        <ScrollView>
            <View style={styles.root}>

                <Text style={styles.title}> Create Account</Text>

                <CustomInput 
                    placeholder="name"
                    value = {name}
                    setValue = {setName}
                />
                <CustomInput 
                    placeholder="surname"
                    value = {surname}
                    setValue = {setSurname}
                />
                <CustomInput 
                    placeholder="email"
                    value = {email}
                    setValue = {setEmail}
                />
                <CustomInput 
                    placeholder="telephone"
                    value = {telephone}
                    setValue = {setTelephone}
                />
                <CustomInput 
                    placeholder="password"
                    value = {password}
                    setValue = {setPassword}
                    secureTextEntry = {true}
                />
                <CustomInput 
                    placeholder="confirm password"
                    value = {confirmPassword}
                    setValue = {setConfirmPassword}
                    secureTextEntry = {true}
                />
                <CustomButton text= "Register" onPress={onSignUpPressed}></CustomButton>
                
                <Text style={styles.text}>By registering, you confirm that you accept our <Text style={styles.link} onPress={onTermsOfUse}>Terms</Text> of Use and <Text style={styles.link} onPress={onTermsOfUse}>Privacy policy</Text></Text>


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
        fontWeight: 'bolt',
        color: '#05160' ,  
     },
     text: {
        color: 'white' ,
        marginVertical: 10,
     },
     link:{
        color: '#FDB075' ,
     },
})

export default RegisterScreen;