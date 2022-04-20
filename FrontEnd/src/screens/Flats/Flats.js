import React from "react";
import {Pressable, View, Text, ScrollView, StyleSheet, ActivityIndicator,Image, useWindowDimensions, Button} from "react-native";
import Axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useState, useEffect} from "react"
import { render } from "express/lib/response";
import Logo from "../../../assets/images/logo.png";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default class Flats extends React.Component{

    constructor(props){
        super(props);
        this.state = {
			current: 0,
            isLoading: true,
            dataSource: null,
        }
    }
    
    componentDidMount(){  
        return fetch('http://10.0.2.2:8000/getByType',{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({"type": "byt"})
        })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        isLoading: false,
                        dataSource: responseJson,
                    })
                })
                .catch((error)=>{
                    console.log(error);
                });
    }

    giveLike = (user_id,property_id) => {
        fetch('http://10.0.2.2:8000/postLike',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({"user_id": user_id, "property_id": property_id})
        })
                .then((res) => {
                    console.log(res.status)
                })
                .catch((error)=>{
                    console.log(error);
                });
                
     }
	giveLike = async (property_id) => {
    	const token = await AsyncStorage.getItem('LOGIN_TOKEN');
      		if(token == null)
            	navigator.replace("Login");
 
         fetch('http://10.0.2.2:8000/postLike',{
         	method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'auth' : token
            },
            body: JSON.stringify({"property_id": property_id})
         })
         .then((res) => {
         	this.setState((prevState, props) => ({
            	current: prevState.current + 1
            }));
            console.log(token)
            console.log(res.status)
            res.text().then(x => console.log(x))
         })
         .catch((error)=>{
             console.log(error);
         });
     }

	formatTime = (dur2) => {
    	let diff = Math.abs(new Date().getTime() - new Date(dur2).getTime()) / 1000;
        let hours = Math.floor(diff / 3600)
        let minutes = Math.floor((diff % 3600) / 60)
        let seconds = Math.floor(diff % 60)
        if(hours >= 24 * 365){
            let years = Math.floor(hours / (365 * 24))
            return years.toString() + (years == 1 ? " year ago" : " years ago")
        }
        if(hours >= 24 * 30){
            let months = Math.floor(hours/ (30 * 24))
            return months.toString() + (months == 1 ? " month ago" : " months ago")
        }
        if(hours >= 24){
            let days = Math.floor(hours / 24)
            return days.toString() + (days == 1 ? " day ago" : " days ago")
        }
 
        if(hours < 24)
            return hours.toString() + (hours == 1 ? " hour ago" : " hours ago")
        if(minutes < 60)
            return minutes.toString() + (minutes == 1 ? " minute ago" : " minutes ago")
        if(seconds < 60)
            return seconds.toString() + (seconds == 1 ? " second ago" : " seconds ago")
     }
 
    schowDetail = (property_id) => {
        this.props.navigation.navigate('DetailScreen',property_id);
    }

    render(){
        if(this.state.isLoading){
            return (<View style={styles.root}><ActivityIndicator/></View>)
        } 
        else {
            let offer = this.state.dataSource.map((val,key)=> {
				return (
                	<View key={key} style={styles.root} >
                    	<View >
                  	 	   <Image
                        		source={val.profile_picture_ref}
                           		style={[styles.profile]}
                            	resizeMode="contain"
                          	/>
                          	<Text>{"Posted by " + val.name}{" "}{val.surname}{" "}{this.formatTime(val.add_date)}</Text>
                          	<Text style={styles.post_title}>{val.title}</Text>
                      	</View>
                        <Pressable onPress = {() => this.schowDetail(val.property_id)} style={{alignItems: 'center', justifyContent: 'center'}}>
                        	<Image
                            	source={Logo}
                            	style={[styles.logo]}
                                resizeMode="contain"
                            />
                        </Pressable>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        	<CustomButton text= {val.like_status + " Likes"} onPress={()=>{this.giveLike(val.property_id)}}></CustomButton>
                        </View>
                    </View>
                 )
            })
       
            return(
                <ScrollView style={{backgroundColor: '#444444'}}>
                    <View style={styles.text}></View>
                    <View>{offer}</View>
                </ScrollView>
                );
            }
        }; 
    };

const styles = StyleSheet.create({
     root: {
         alignText: 'left',
         padding: 20,
         backgroundColor: '#444444',
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
      buttonStyle: {
         marginHorizontal: 2,
         marginTop: 5,
      },
      post_title: {
         textAlign: 'left',
         fontSize: 20,
         fontWeight: 'bold',
         color: '#3B71F7',
      },
 })

