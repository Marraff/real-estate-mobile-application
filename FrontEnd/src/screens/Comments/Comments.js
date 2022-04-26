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

    render(){
        
        const chatMessages = this.state.chatMessages.map(chatMessage => {
        return <Text key={chatMessage.comment} style={{ fontSize: 25, color: 'white' }}>{chatMessage.author_name}{":  "}{chatMessage.comment}</Text>
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

