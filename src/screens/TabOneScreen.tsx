import {ActivityIndicator, Pressable, ScrollView, StyleSheet} from 'react-native';
import {Text, View} from '../components/Themed';
import {RootTabScreenProps} from '../../types';
import {useCallback, useEffect, useState} from "react";
import * as Clipboard from 'expo-clipboard';
import {API_URL} from "../../Utils";

export default function TabOneScreen({navigation}: RootTabScreenProps<'TabOne'>) {

    let [fileData, setFileData] = useState([]);
    let loading = useState(false);
    // @ts-ignore
    let key = useState( global['api_key']);
    useEffect(() => {
        return navigation.addListener('focus', async () => {
            // @ts-ignore
            let apiKey = global['api_key'];
            if (!!apiKey) {
                key[1](apiKey);
                getList().catch(() => null)
            } else {
                setFileData([]);
                key[1]('');
            }
        });
    }, [navigation])


    const getList = useCallback(async () => {
        if(loading[0])return;
        loading[1](true);
        // @ts-ignore
        fetch(API_URL, {headers: {'Authorization': 'Bearer ' + global['api_key']}}).then((result) => result.json().then((data) => {
                loading[1](false);
                if (data.ok) {
                    console.log(data)
                    setFileData(data.value)
                } else {
                    alert(data.error.message);
                }
            })
        ).catch((error) => alert(JSON.stringify(error)));

    },[key[0]]);


    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>

            {
                loading[0] ? <ActivityIndicator style={{marginVertical: 10, marginHorizontal: 'auto', width: '100%'}}
                                                color={'#268c89'} size={'large'}/> : null
            }
            {!key[0] ? <Text style={{textAlign: 'center', margin: 10}}>Please set the API KEY</Text> : null}
            {
                fileData.map((file: any) => {
                    return (<View style={{
                        width: '95%',
                        marginHorizontal: '2.5%',
                        marginVertical: 10,
                        padding: 10,
                        borderRadius: 10
                    }} key={file.cid}>

                        <Pressable onPress={async () => {
                            await Clipboard.setStringAsync(file.cid);
                            alert('Copied:' + file.cid)
                        }}>
                            <Text style={{fontWeight: 'bold'}}>CID:{file.cid}</Text>
                        </Pressable>
                        <Text
                            style={{color: file.pin.status === 'pinned' ? '#268c89' : 'tomato'}}>PinStatus:{file.pin.status} </Text>
                        <Text>Type:{file.type} Size:{file.size}</Text>
                        <Text>Created:{file.created}</Text>
                        <ScrollView horizontal={true} contentContainerStyle={{padding: 5}}>
                            {
                                file.deals.map((de: any, i: number) => {
                                    return <View style={{margin: 5, borderColor: '#000', borderWidth: 0.7, padding: 4}}
                                                 key={i}>
                                        <Text>File{i + 1}</Text>
                                        <Pressable onPress={async () => {
                                            await Clipboard.setStringAsync(file.pieceCid);
                                            alert('Copied:' + file.pieceCid)

                                        }
                                        }>
                                            <Text
                                                style={{color: '#268c89'}}>PieceCid:{de.pieceCid.slice(0, 20) + '...'}</Text>
                                        </Pressable>
                                        <Text>Activation:{de.dealActivation}</Text>
                                        <Text>Expiration:{de.dealExpiration}</Text>
                                        <Text style={{
                                            color: '#fff',
                                            backgroundColor: de.status === 'active' ? '#42883f' : 'tomato',
                                            textAlign: 'center',
                                            paddingHorizontal: 4,
                                            paddingVertical: 4,
                                            marginTop: 10
                                        }}>{de.status}</Text>
                                    </View>
                                })
                            }


                        </ScrollView>
                    </View>)
                })
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
});
