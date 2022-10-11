import {StatusBar} from 'expo-status-bar';
import {ActivityIndicator, Platform, Pressable, ScrollView, TextInput} from 'react-native';
import {Text, View} from '../components/Themed';
import {useCallback, useEffect, useState} from "react";
import * as Clipboard from "expo-clipboard";
import {API_URL} from "../../Utils";

export default function ModalScreen() {

    let loading = useState(false);
    let [cid, setCID] = useState('');
    let detail: { [x: string]: any, deals?: any, pin?: any } = {};
    let [file, setDetail] = useState(detail);//更新详情
    // @ts-ignore
    let key = useState(global['api_key']);

    const getDetail = useCallback(async (cid: string) => {
        if(!key[0])return;
        let res = await fetch(API_URL + '/' + cid, {headers: {'Authorization': 'Bearer ' + key[0]}}).then((result) => result.json());
        loading[1](false);
        if (res.ok) {
            setDetail(res.value);
        } else {
            alert(JSON.stringify(res.error.message));
        }
    }, [cid]);

    useEffect(() => {
        loading[0] && getDetail(cid).catch((res) => alert(JSON.stringify(res)))
    }, [cid]);

    return (
        <ScrollView style={{flex: 1, backgroundColor: 'rgb(221,231,220)'}}>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
            <Text style={{marginTop: '5%', marginLeft: '5%', fontWeight: 'bold'}}>Includes the IPFS pinning state and the Filecoin deal state.</Text>
            <TextInput style={{
                borderWidth: 0.7,
                borderColor: 'rgba(0,0,0,0.45)',
                width: '90%',
                margin: '5%',
                paddingVertical: 10,
                paddingHorizontal: 5
            }} onSubmitEditing={({nativeEvent: {text}}) => {
                if (text.length === 0) return;
                loading[1](true);
                setCID(text);
            }} placeholder={'Your CID'}/>
            {file.cid ? <View style={{
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
                            return <View
                                style={{margin: 5, borderColor: '#000', borderWidth: 0.7, padding: 4, width: 300}}
                                key={i}>
                                <Text>File{i + 1}</Text>
                                <Pressable onPress={async () => {
                                    await Clipboard.setStringAsync(file.pieceCid);
                                    alert('Copied:' + file.pieceCid)
                                }
                                }>
                                    <Text style={{color: '#268c89'}}>PieceCid:{de.pieceCid}</Text>
                                </Pressable>
                                <Text style={{marginTop: 5}}>BatchRootCid:{de.batchRootCid}</Text>
                                <Text style={{marginTop: 5}}>ChainDealID:{de.chainDealID}</Text>
                                <Text style={{marginTop: 5}}>DatamodelSelector:{de.datamodelSelector}</Text>
                                <Text style={{marginTop: 5}}>LastChanged:{de.lastChanged}</Text>
                                <Text style={{marginTop: 5}}>Miner:{de.miner}</Text>
                                <Text style={{marginTop: 5}}>Activation:{de.dealActivation}</Text>
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
            </View> : null}
            {loading[0] ? <ActivityIndicator color={'#268c89'} style={{width: '100%', margin: 20}}/> : null}

        </ScrollView>
    );
}
