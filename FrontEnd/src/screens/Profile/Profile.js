import React from "react";
import {View, Text, ScrollView, StyleSheet, ActivityIndicator,Image, useWindowDimensions, Button} from "react-native";
import Axios from "axios"
import {useState, useEffect} from "react"
import { render } from "express/lib/response";
import Logo from "../../../assets/images/logo.jpg";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            dataSource: null,
            users_id: this.props.route.params,
        }
    }
    
    componentDidMount(){  
        return fetch('http://10.0.2.2:8000/myOffers',{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({"user_id": this.state.users_id})
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
    getHome = (users_id) => {
        this.props.navigation.navigate('Home',users_id);
                
     }
    profile = (users_id) => {
           
        this.props.navigation.navigate('Profile',users_id);
    }
    schowDetail = (property_id) => {
        
        this.props.navigation.navigate('DetailScreen',property_id);
    }
    housesOnly = (users_id) => {
            
        this.props.navigation.navigate('Houses',users_id);
    }
    flatsOnly = (users_id) => {
        
        this.props.navigation.navigate('Flats',users_id);
    }
    all = (users_id) => {
        
        this.props.navigation.navigate('Home',users_id);
    }
    add = (users_id) => {
        
        this.props.navigation.navigate('AddProperty',{user_id: users_id});
    }
    deleteProperty = (property_id,user_id) => {
        console.log(property_id,user_id)
        fetch('http://10.0.2.2:8000/delete',{
            method: 'DELETE',
            headers:{
                'Content-Type':'application/json'
                },
                body: JSON.stringify({"property_id": property_id, "user_id": user_id})
        })
                .then((res) => {
                    console.log(res.status)
                })
                .catch((error)=>{
                    console.log(error);
                });
                
    }
    editPost = (post_id,user_id) => {
        //console.log(post_id,user_id)
        this.props.navigation.navigate('EditPost',{user_id: user_id, post_id: post_id});
                
    }
    editProperty = (property_id,user_id) => {
        console.log(property_id,user_id)
        this.props.navigation.navigate('EditProperty',{user_id: user_id, property_id: property_id});
                
    }


    render(){

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
                                    this.editPost(val.id,val.users_id);
                                    }}>
                                </Button>
                             </View>
                             <View style={styles.buttonStyle}>
                                <Button title= "Edit property" onPress={() => {
                                    this.editProperty(val.property_id,val.users_id);
                                    }}>
                                </Button>
                             </View>
                             <View style={styles.buttonStyle}>
                                <Button title= "Delete" onPress={() => {
                                    this.deleteProperty(val.property_id,val.users_id);
                                    }}>
                                </Button>
                             </View>
                             </View>
                       </View>
            })
       
            return(
                <ScrollView>
                    <View style={styles.text}>
                    <View style={{ flexDirection:"row" }}>
                        <View style={styles.buttonStyle}>
                                <Button title="Profile" onPress={() => {
                                this.profile(this.state.users_id);
                            }}></Button>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title="Call"></Button>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title="Houses" oonPress={() => {
                                this.housesOnly(this.state.users_id);
                            }}></Button>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title="Flats"  onPress={() => {
                                this.flatsOnly(this.state.users_id);
                            }}></Button>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title="All offers" onPress={() => {
                                this.all(this.state.users_id);
                            }}></Button>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title="Add" onPress={() => {
                                this.add(this.state.users_id);
                            }}></Button>
                        </View>
                    </View>
                   
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
     buttonStyle: {
        marginHorizontal: 2,
        marginTop: 5
      },
})
