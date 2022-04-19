/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { StyleSheet, SafeAreaView, Text } from 'react-native';
 import SignInScreen from './src/screens/SignInScreen';
 import RegisterScreen from './src/screens/RegisterScreen/RegisterScreen';
 import Navigation from './src/navigation';
 import Profile from './src/screens/Profile/Profile';

 const App = ()=>  {
   
       return (
          <SafeAreaView style = {styles.root}>
             <Navigation/>
          </SafeAreaView>
       );
    
 }
 
 const styles = StyleSheet.create({
    root: {
       flex: 1,
       backgroundColor: "#444444",
    },
 });

 export default App;
