import React from "react";
import {View, Text, ScrollView, StyleSheet, ActivityIndicator,Image, useWindowDimensions} from "react-native";
import Axios from "axios"
import {useState, useEffect} from "react"
import { render } from "express/lib/response";
import Logo from "../../../assets/images/logo.png";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

//const Home = () => {  
export default class DetailScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            property_id: this.props.route.params,
        }
    }
    
    //componentDidMount(){  
    
    componentDidMount(){
        return fetch('http://10.0.2.2:8000/getData',{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({"property_id": this.state.property_id})
        })
                .then((response) => response.json())
                .then((resposneJson) => {
                    this.setState({
                        isLoading: false,
                        dataSource: resposneJson,
                    })
                })
                .catch((error)=>{
                    console.log(error);
                });
    }
    render(){

        const onSignPress = () => {
            this.props.navigation.navigate('Home');
        }
        

        if(this.state.isLoading){
            return (
                <View style={styles.root}>
                    <ActivityIndicator/>
                </View>
            )
        } 

        else {
        
            let offer = this.state.dataSource.map((val,key)=> {
                
                return <View key={key} style={styles.root}>
                            <Image 
                                source={val.profile_picture_ref} 
                                style={[styles.profile]} 
                                resizeMode="contain" 
                            />
                            <Text>{"Type: "+val.type}</Text>
                            <Text>{"Size: "+val.size+" m2"}</Text>
                            <Text>{"Price: "+val.price}</Text>
                            <Text>{"rooms: "+val.rooms}</Text>
                            <Text>{"Description: "+val.description}</Text>
                            <Text>{val.profile_picture_ref}</Text>
                            
                            <Image 
                                source={Logo} 
                                style={[styles.logo]} 
                                resizeMode="contain" 
                            />
                            <CustomButton text= "Home page" onPress={onSignPress}></CustomButton>
                       </View>
            })
       
            return(
                <ScrollView>
                    <View style={styles.text}>
                    {offer}
                    </View>
                </ScrollView>
                );
            }
        }; 
    };


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 5,

    },
    logo: {
        maxWidth: 380,
        width: '70%',
        maxHeight: 200,
        
    },
    title:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#05160' ,  
     },
     text: {
        color: 'white' ,
        marginVertical: 10,
     },
     profile:{
        maxWidth: 50,
        width: '15%',
        maxHeight: 30,
     },
})
