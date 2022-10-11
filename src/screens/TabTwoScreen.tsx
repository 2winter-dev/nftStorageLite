import {Button, StyleSheet, Linking, Pressable, Alert, TextInput, Image} from 'react-native';
import {Text, View} from '../components/Themed';
import useColorScheme from "../hooks/useColorScheme";
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from "react";
import {API_URL} from "../../Utils";
export default function TabTwoScreen() {
    // @ts-ignore
    let {api_key} = global;
    let apiKey = useState(api_key);
    return (
        <View style={styles.container}>

            <Image source={require('../assets/images/icon.png')} style={{width:150,height:150,alignSelf:'center',margin:10}} resizeMode={'contain'}/>

            <Pressable onPress={()=>{
                Linking.openURL('https://nft.storage/login/')
            }}>
                <View style={{...styles.card,backgroundColor:'#42883f',justifyContent:'space-between'}}>

                    <Text style={{'color':'#fff',textAlign:'center',fontWeight:'bold',padding:5,fontSize:18}}>GET API KEY {API_URL}</Text>
                    <FontAwesome name={'arrow-right'} color={'#fff'}/>
                </View>
            </Pressable>


                <View style={{...styles.card,backgroundColor:'#42883f',justifyContent:'space-between'}}>
                    <Text style={{'color':'#fff',textAlign:'center',fontWeight:'bold',padding:5,fontSize:18,width:'20%'}}>API KEY</Text>
                    <TextInput onSubmitEditing={({nativeEvent:{text}})=>{
                        if(text.length === 0)return;
                        // @ts-ignore
                        global['api_key'] = text;
                        AsyncStorage.setItem('@api_key', text).catch((e)=>alert(JSON.stringify(e)));
                        alert('success.');


                    }} style={{backgroundColor:'rgba(66,136,63,0.7)',width:'80%',borderColor:'rgba(0,0,0,0.8)',paddingHorizontal:5,borderWidth:0.2}} placeholderTextColor={'rgba(255,255,255,0.79)'} placeholder={(apiKey[0]?.slice(0, 100) ?? '')+ '...'}/>

                </View>

            <View style={{...styles.card,flexDirection:'column',alignItems:'flex-start'}}>
                <Text>About API KEY</Text>
                <Text style={{marginTop:5}}>Your API KEY will be directly used for NFTStorage open interface requests, no third party service
                    transfer.</Text>
                <Text style={{marginTop:5}}><Pressable onPress={()=>Linking.openURL('https://nft.storage/api-docs/')}><Text style={{color: 'blue'}}>More see https://nft.storage/api-docs/</Text></Pressable></Text>
            </View>

            <View style={{...styles.card,flexDirection:'column',alignItems:'flex-start'}}>
                <Text>About APP</Text>
                <Text style={{marginTop:5}}>Supports the following apis on NFTStorage:</Text>
                <Text style={{marginTop:5}}><Text style={{color:'#42883f',fontWeight:'bold'}}>GET</Text>: Obtains the file list of the account</Text>
                <Text style={{marginTop:5}}><Text style={{color:'#42883f',fontWeight:'bold'}}>GET</Text>: CID Queries file details</Text>
                <Text style={{marginTop:5}}><Text style={{color:'#48a5e7',fontWeight:'bold'}}>POST</Text>: stores files</Text>
                <Text style={{marginTop:5}}><Text style={{color:'#48a5e7',fontWeight:'bold'}}>POST</Text>: stores the ERC-1155 NFT</Text>
                <Text style={{marginTop:5}}><Text style={{color:'tomato',fontWeight:'bold'}}>DELETE</Text>: Use CID to delete files</Text>

            </View>

            <Pressable onPress={async ()=>{
                await AsyncStorage.clear();
                // @ts-ignore
                global['api_key'] = undefined;
                alert('success.');
                apiKey[1]('');

            }}>
                <View style={{width:'95%',backgroundColor:'#9d1f1f',margin:'2.5%',padding:15,borderRadius:5}}>
                    <Text style={{textAlign:'center',fontWeight:'bold',color:'#fff'}}>Reset API KEY </Text>
                </View>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    card:{flexDirection: 'row', alignItems: 'center',borderColor:'#42883f',borderWidth:2,padding:10,margin:'2.5%'}
});
