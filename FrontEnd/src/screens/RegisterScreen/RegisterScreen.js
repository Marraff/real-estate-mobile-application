import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";

import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import IpAddress from "../../components/IpAddress";

const RegisterScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const onSignUpPressed = () => {
        if (name.length>0 && surname.length>0 && email.length>0 && telephone.length>0 && password.length>0 && confirmPassword.length>0 && password==confirmPassword ){
            fetch(`http://${IpAddress}:8000/register/`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "name": name,
                        "surname": surname,
                        "email": email ,
                        "telephone": telephone,
                        "password": password
                    })
            })
            .then((response)=> {
                if (response.status == 200 ){
                    console.log("User added to database");
                    navigation.navigate('SignIn');
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        }
    }
    const onTermsOfUse = () => {
        console.warn('not ready yet');
    }

    return(
        <ScrollView style={{backgroundColor: '#444444'}}>
            <View style={styles.root}>
                <Text style={styles.title}> Create Account</Text>

                <CustomInput placeholder="name" value = {name} setValue = {setName} />
                <CustomInput placeholder="surname" value = {surname} setValue = {setSurname} />
                <CustomInput placeholder="email" value = {email} setValue = {setEmail} />
                <CustomInput placeholder="telephone" value = {telephone} setValue = {setTelephone} />
                <CustomInput placeholder="password" value = {password} setValue = {setPassword} secureTextEntry = {true} />
                <CustomInput placeholder="confirm password" value = {confirmPassword} setValue = {setConfirmPassword} secureTextEntry = {true} />

                <CustomButton text= "Register" onPress={onSignUpPressed}></CustomButton>
                
                <Text style={styles.text}>By registering, you confirm that you accept our 
					<Text style={styles.link} onPress={onTermsOfUse}>Terms</Text> of Use and 
					<Text style={styles.link} onPress={onTermsOfUse}>Privacy policy</Text></Text>
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

export default RegisterScreen;
