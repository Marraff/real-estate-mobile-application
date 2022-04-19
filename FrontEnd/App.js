/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow strict-local
*/

import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import Navigation from './src/navigation';

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
