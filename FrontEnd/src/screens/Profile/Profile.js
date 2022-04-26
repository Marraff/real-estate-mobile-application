import React from "react";
import {View, Text, ScrollView, StyleSheet, ActivityIndicator,Image, useWindowDimensions, Button} from "react-native";
import Axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useState, useEffect} from "react"
import { render } from "express/lib/response";
import Logo from "../../../assets/images/logo.png";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import IpAddress from "../../components/IpAddress";

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
			current: 0,
            isLoading: true,
            dataSource: null,
        }
    }
    
    componentDidMount(){  
		const mount = async() => {
			const token = await AsyncStorage.getItem('LOGIN_TOKEN');
       		return fetch(`http://${IpAddress}:8000/myOffers`,{
       		    method: 'PUT',
       		    headers:{
       		        'Content-Type':'application/json',
	   				'auth': token,
       		        },
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
		mount()
    }
		
    componentDidUpdate(){  
		const mount = async() => {
			const token = await AsyncStorage.getItem('LOGIN_TOKEN');
       		return fetch(`http://${IpAddress}:8000/myOffers`,{
       		    method: 'PUT',
       		    headers:{
       		        'Content-Type':'application/json',
	   				'auth': token,
       		        },
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
		mount()
    }

    schowDetail = (property_id) => {
        this.props.navigation.navigate('DetailScreen',property_id);
    }

	onLogoutPressed = async () => {
		await AsyncStorage.removeItem('LOGIN_TOKEN');
		console.log("Goodbye")
		this.props.navigation.replace('Login')
	}

    deleteProperty = async (property_id) => {
		const token = await AsyncStorage.getItem('LOGIN_TOKEN')
        fetch(`http://${IpAddress}:8000/delete`,{
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json',
				'auth' : token,
                },
                body: JSON.stringify({"property_id": property_id})
        })
        .then((res) => {
			this.setState((prevState, props) => ({
            	current: prevState.current + 1
            }));
         })
         .catch((error)=>{
         	console.log(error);
         });
    }

    editPost = (post_id) => {
        console.log(post_id)
        this.props.navigation.navigate('EditPost',{post_id: post_id});
    }

    editProperty = (property_id) => {
        this.props.navigation.navigate('EditProperty',{property_id: property_id});
    }

    render(){
        if(this.state.isLoading){
            return (<View style={styles.root}><ActivityIndicator/></View>)
        } 
        else {
            let offer = this.state.dataSource.map((val,key)=> {
                return ( 
					<View key={key} style={styles.root}>
                        <Image 
                            source={val.profile_picture_ref} 
                            style={[styles.profile]} 
                            resizeMode="contain" 
                        />
                        <Text>{val.name}{" "}{val.surname}{" "}{val.add_date.split(" ",4)+" "}</Text>
                        <Text>{"Title: "+val.title}</Text>
                        <Text>{"Description: "+val.text}</Text>
                        <Text>{val.profile_picture_ref}</Text>
                        
                        <Image 
                            source={Logo} 
                            style={[styles.logo]} 
                            resizeMode="contain" 
                        />
                         <View style={{ flexDirection:"row" }}>
                         <View style={styles.buttonStyle}>
                            <Button title= "Show detail" onPress={() => {
                                this.schowDetail(val.property_id);
                                }}>
                            </Button>
                         </View>
                         <View style={styles.buttonStyle}>
                            <Button title= "Edit post" onPress={() => {
                                this.editPost(val.post_id);
                                }}>
                            </Button>
                         </View>
                         <View style={styles.buttonStyle}>
                            <Button title= "Edit property" onPress={() => {
                                this.editProperty(val.property_id);
                                }}>
                            </Button>
                         </View>
                         <View style={styles.buttonStyle}>
                            <Button title= "Delete" onPress={() => {
                                this.deleteProperty(val.property_id);
                                }}>
                            </Button>
                         </View>
                         </View>
                    </View>
				)
            })
       
            return(
                <ScrollView style={{backgroundColor:'#444444'}}>
					<View style={styles.root}>
						<CustomButton text="Logout" onPress={this.onLogoutPressed}></CustomButton>
					</View>
                    {offer}
                </ScrollView>
                );
            }
        }; 
    };


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
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
        marginTop: 5
      },
})
