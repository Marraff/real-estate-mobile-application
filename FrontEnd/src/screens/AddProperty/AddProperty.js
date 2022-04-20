import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";


import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";



const AddProperty = ({navigation}) => {
    const [type, setTyte] = useState('');
    const [size, setSize] = useState();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');

    const createOffer = async () => {
        const token = await AsyncStorage.getItem('LOGIN_TOKEN');
		if(token == null)
			navigation.replace('Login')

        if (type.length>0 && size.length>0 && price.length>0 && description.length>0 && rooms.length>0 && state.length>0 && 
            city.length>0 && street.length>0 && postalCode.length>0 && title.length>0 && text.length>0){
            fetch('http://10.0.2.2:8000/newPost',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
					'auth': token
                    },
                    body: JSON.stringify({
                        "type": type,
                        "size": parseInt(size),
                        "price": price ,
                        "description": description,
                        "rooms": rooms,
                        "state": state,
                        "city": city,
                        "street": street,
                        "postal_code": postalCode,
                        "title": title,
                        "text": text,
                    })
            })
            .then((response)=> {
                if (response.status == 200 ){
                    console.log("Offer added to database");
                    navigation.navigate('Profile');
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
                <Text style={styles.title}> Create Offer</Text>
                <CustomInput placeholder="type" value = {type} setValue = {setTyte}/>
                <CustomInput placeholder="size" value = {size} setValue = {setSize}/>
                <CustomInput placeholder="price" value = {price} setValue = {setPrice}/>
                <CustomInput placeholder="description" value = {description} setValue = {setDescription}/>
                <CustomInput placeholder="rooms" value = {rooms} setValue = {setRooms}/>
                <CustomInput placeholder="state" value = {state} setValue = {setState}/>
                <CustomInput placeholder="city" value = {city} setValue = {setCity}/>
                <CustomInput placeholder="street" value = {street} setValue = {setStreet}/>
                <CustomInput placeholder="postal code" value = {postalCode} setValue = {setPostalCode}/>
                <CustomInput placeholder="title" value = {title} setValue = {setTitle}/>
                <CustomInput placeholder="text" value = {text} setValue = {setText}/>
                <CustomButton text= "Create" onPress={createOffer}></CustomButton>
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

export default AddProperty;
