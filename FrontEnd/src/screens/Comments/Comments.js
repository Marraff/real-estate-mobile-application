import React from "react";
import {TextInput, Pressable, View, Text, ScrollView, StyleSheet, ActivityIndicator,Image, useWindowDimensions, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from "axios"
import {useState, useEffect} from "react"
import { render } from "express/lib/response";
import Logo from "../../../assets/images/logo.png";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import IpAddress from "../../components/IpAddress";
import io from "socket.io-client";

export default class Comments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
			current : 0,
            isLoading: true,
            dataSource: null,     
            post_id: this.props.route.params.post_id,
            name: this.props.route.params.name,
            chatMessage: "",
            chatMessages: [],
        }
    }
    
    componentDidMount(){  
        this.socket = io(`http://${IpAddress}:8000`);
        /*
        this.socket.on("chat message",msg => {
            this.setState({chatMessages: [...this.state.chatMessages, msg]});
        });
        */
        this.socket.emit("display comments", this.state.post_id);
        
        this.socket.on("display comments",(result)=>{
           const copy = result;
           this.setState({chatMessages: copy});

           console.log("State:   "+this.state.chatMessages)
           const chatMessages = this.state.chatMessages.map(chatMessage => {
             console.log(chatMessage.author_name+" :"+chatMessage.comment)
            });
        });
        
    }
	
	submitMessage(){
        //console.log(this.state.post_id, this.state.name)
        this.socket.emit(`chat message`, this.state.chatMessage, this.state.post_id, this.state.name);
        this.setState({chatMessage: ""});
        this.socket.emit("display comments", this.state.post_id);
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

    render(){
        
        const chatMessages = this.state.chatMessages.map(chatMessage => {
        return <Text key={chatMessage.comment} style={{ fontSize: 25, color: 'white' }}>{this.formatTime(chatMessage.add_date)}{":  "}{chatMessage.comment}</Text>
        });
    
        return(
            <ScrollView style={{backgroundColor: '#444444'}}>
                <View style={styles.container}>
                
                    <TextInput 
                    style = {{height: 70, borderWidth: 2, fontSize: 25, color: 'white' }}
                    autoCorrect={false} 
                    placeholder = {'Add comment'}
                    value = {this.state.chatMessage}
                    onSubmitEditing={()=> this.submitMessage()}
                    onChangeText={chatMessage => {
                        this.setState({chatMessage});
                    }}
                    ></TextInput>
                    
                </View>
                {chatMessages}
            </ScrollView>
            );
        }
    };


const styles = StyleSheet.create({
    container: {
		flex: 1,
        backgroundColor: '#444444',

    },
     text: {
        width: '95%',
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,

        paddingHorizontal: 10,
        padding: 15,
        marginVertical: 7,
        alignItems: 'center',
        
     },
})

