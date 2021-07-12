import React, { useState,useEffect } from 'react';
import {
        Text,
        View,
       StyleSheet,
        TouchableHighlight,
       ImageBackground,
        Dimensions,
        FlatList,
        ActivityIndicator,
    TextInput } from 'react-native';



import axios from 'axios'
import {inject,observer } from "mobx-react";

import {SERVER_ADDRESS} from '../../../data/address'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {Container} from "./styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SideTab = createMaterialTopTabNavigator();
const numColumns=2
const cache = []

const Create = ({route, navigation,RootStore}) => {
    
	const [search, setSearch] = useState('');
	const [videos,setVideos] = useState([])
    const bar = [{type:'input'},{type:'blank'}]
  
	const [time,setTime] = useState(Date.now())
    const [priva,setPriva]=useState(1)

	useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', async() => {
                    // do something
                    var result = await axios.get(SERVER_ADDRESS+`/front-end/getCreatedVideo/${RootStore.UserId}`)
                    let start=[{type:'input'},{type:'blank'}]
                    setVideos(start.concat(result['data']))
                   
                   
            
                    /*
                        [
                            {
                            video_id:,
                            video_image:|videoImages|videoname
                            },
                            ......
                    ]
                    */
                });
        return unsubscribe

 
		
    },[navigation])

    useEffect(()=>{
        const unsubscribe = navigation.addListener('blur', async() => {
            setVideos([])
        });

        return unsubscribe

    })


    

    const convertViews = (param)=>{
        if(param>1000)
            return (param/1000).toFixed(1)+'k'
        else
            return param
    }

    const Input = ()=>{
		return(
      
        <View style={{width:Dimensions.get('window').width}}>
		<TextInput
                    //placeholder={search}
                    placeholder="Search"
                    value={search}
                    placeHolderTextColor="#333"
                    style={{
                        flex: 1,
                        marginTop: 10,
                        marginBottom: 15,
                        paddingHorizontal: 15,
                        alignSelf: 'stretch',
                        width: StyleSheet.hairLineWidth,
                        backgroundColor: '#F5F5F5'
                    }}
                    onChangeText={(text) => setSearch(text)}
                    onSubmitEditing={async() => {
                        if(search==''){
                            let start=[{type:'input'},{type:'blank'}]
                            setVideos(start.concat(cache[0]))
                        }else{
                            let start=[{type:'input'},{type:'blank'}]
                            setVideos(start.concat(cache[0].filter((value)=>{
                                
                                return value.name.includes(search)
                            }))
                            )
                        }
                     
                        // var result = await axios.get(SERVER_ADDRESS+`/front-end/searchVideos/${search}`)
                        // setVideos(bar.concat(result['data']))
                    }}
                />
             
                        </View>
                       

		)
	}




    const renderItem = ({ item, index }) => {

        
  
        return (
            <View>
            {index==0?Input():index==1?<></>
                :
            <TouchableHighlight onPress={()=>{
                console.log(RootStore.UserId==item.creator_id)
                console.log(item.Private)
               
                navigation.navigate('Video',{videoId:item.video_id})
                
            }}>
            <ImageBackground
              source={{uri:SERVER_ADDRESS+item.video_image}}
              style={{
                width: ((Dimensions.get('window').width-40) / 2),
                height: ((Dimensions.get('window').width) / 2)*1.2,
                marginHorizontal: 1,
                marginBottom: 1,
                alignSelf:'center'
            }}
            >
            <>{
            priva==0? <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome style={{right: 3}} name={'lock'} size={80} color={'white'}/>
                    </View>
            :
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>  
                <View style={{position: 'absolute', top: 0,right: 3, bottom: 6,  alignItems: 'flex-end',flexDirection:'row'}}>
                    <FontAwesome style={{right: 3}} name={'heart'} size={16} color={'white'}/>
                    <Text style={{color:'white', fontSize: 12}}>{convertViews(item.likes)}</Text>
                </View>
            </View>
                 }
            </>
    
            </ImageBackground>
          </TouchableHighlight>
                }
                </View>
        );
      };

	return (
		<Container>    
             <View style={{paddingHorizontal:15}}>
           <FlatList
            data = {videos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            numColumns={numColumns}

           />   
           </View>     
        </Container>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: "#169",
        height: 200,
        margin: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "red",
        fontSize: 20,
    },

    loadMore: {
        alignItems: "center"
    },
    indicator: {
        color: "red",
        margin: 10
    }
});


export default inject('RootStore')(observer(Create));