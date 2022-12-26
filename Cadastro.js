import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function Cadastro({ route, navigation }) {
  const director = route.params.director;
  const [title, setTitle] = useState(route.params.title);
  const [releaseYear, setReleaseYear] = useState(route.params.releaseYear);
  const [runningTime, setRunningTime] = useState(route.params.runningTime);
  const [distributedBy, setDistributedBy] = useState(route.params.distributedBy);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 10}}>
        {!route.params.isEditing? "Cadastrar" : "Editar"} filme de {director}
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Título"
        value= {title}
        onChangeText={(titleInput) => setTitle(titleInput)}></TextInput>
      <TextInput
        style={styles.textInput}
        placeholder="Ano de lançamento"
        value = {releaseYear}
        onChangeText={(releaseYearInput) =>
          setReleaseYear(releaseYearInput)
        }></TextInput>
      <TextInput
        style={styles.textInput}
        placeholder="Duração"
        value = {runningTime}
        onChangeText={(runningTimeInput) =>
          setRunningTime(runningTimeInput)
        }></TextInput>
      <TextInput
        style={styles.textInput}
        placeholder="Distribuidora"
        value = {distributedBy}
        onChangeText={(distributedByInput) =>
          setDistributedBy(distributedByInput)
        }></TextInput>
      <TouchableOpacity
        style={{
          marginTop: 400,
          backgroundColor: 'blue',
          height: 50,
          width: 100,
          alignSelf: 'center',
          alignItems: 'center',
          marginBottom: 40,
          borderRadius: 20,
        }}
        onPress={() => {
          console.log(!route.params.isEditing? 'POST': 'PUT')
          fetch(!route.params.isEditing? 'https://tet-api.glitch.me/movies' : 'https://tet-api.glitch.me/movies/' + route.params.id, {
            method: !route.params.isEditing? 'POST': 'PUT',
            body: JSON.stringify({
              title: title,
              releaseYear: releaseYear,
              director: director,
              distributedBy: distributedBy,
              runningTime: runningTime
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          navigation.pop(true)
          });
        
        }
        }>
        <Text
          style={{
            color: 'white',
            padding: 13,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
           {!route.params.isEditing? "Cadastrar" : "Editar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop: 20,
  },
  textInput: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
});
