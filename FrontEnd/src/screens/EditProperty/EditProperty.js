import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView} from "react-native";


import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";



const EditProperty = ({route}) => {

    const [type, setTyte] = useState('');
    const [size, setSize] = useState();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState('');

    const  user_id  = route.params.user_id;
    const  property_id  = route.params.property_id;
    
    const navigation = useNavigation();
    
    const changeProperty = () => {
        
        if (type.length>0 && size.length>0 && price.length>0 && description.length>0 && rooms.length>0){
            fetch('http://10.0.2.2:8000/changeProperty',{
                method: 'PUT',
                headers:{
                    'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "type": type,
                        "size": parseInt(size),
                        "price": price ,
                        "description": description,
                        "rooms": rooms,
                    
                        "user_id": user_id,
                        "property_id": property_id

                    })
            })
            .then((response)=> {
                if (response.status == 200 ){
                    console.log("Property changed in database");
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

                <Text style={styles.title}> Change Property</Text>

                <CustomInput 
                    placeholder="type"
                    value = {type}
                    setValue = {setTyte}
                />
                <CustomInput 
                    placeholder="size"
                    value = {size}
                    setValue = {setSize}
                />
                <CustomInput 
                    placeholder="price"
                    value = {price}
                    setValue = {setPrice}
                />
                <CustomInput 
                    placeholder="description"
                    value = {description}
                    setValue = {setDescription}
                />
                <CustomInput 
                    placeholder="rooms"
                    value = {rooms}
                    setValue = {setRooms}
                    
                />
                <CustomButton text= "Change Property" onPress={changeProperty}></CustomButton>
                
                

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

export default EditProperty;
