import * as React from 'react';
import { useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cadastro from './Cadastro';
const Stack = createNativeStackNavigator();

function DeleteItem(id) {
  fetch(
    'https://tet-api.glitch.me/Movies/' +
      id,
    {
      method: 'DELETE',
    }
  ).then(() => console.log('Item deletado:' + title));
}

function ListItems({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    console.log('teste 2');

    fetch('https://tet-api.glitch.me/Director')
      .then((response) => response.json())
      .then((items) => {
        if (mounted) {
          console.log(items);
          setData(items);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => (mounted = false);
  }, []);

  const Item = (data) => (
    <View style={styles.listItem}>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{data.item.directorName}</Text>
        <Text>{data.item.activeSince}</Text>
      </View>
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{ color: 'green' }}
          onPress={() => {
            navigation.navigate('Details', {
              name: data.item.directorName,
            });
          }}>
          Ver
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={Item}
        keyExtractor={(item) => item.directorName}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  director = route.params.name;
  console.log(director)
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false)
  const isFocused = useIsFocused();

  useEffect(() => {
    let mounted = true;
    fetch(
      'https://tet-api.glitch.me/DirectorMovies/' +
        director
    )
      .then((res) => res.json())
      .then((items) => {
        if (mounted) {
          console.log(items);
          setData(items);
        }
      });
    return () => (mounted = false);
  }, [isFocused, refresh]);

  const Item = (data) => (
    <View style={styles.listItem}>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Text style={{ fontWeight: 'bold' }}>{data.item.title}</Text>
        <Text>{data.item.releaseYear}</Text>
        <Text>{data.item.distributedBy}</Text>
        <Text>{data.item.runningTime} minutes</Text>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cadastro', {
                id: data.item.id,
                title: data.item.title,
                releaseYear: data.item.releaseYear,
                distributedBy: data.item.distributedBy,
                runningTime: data.item.runningTime,
                director: data.item.director,
                isEditing: true,
              });
            }}>
            <Text style={{ color: 'blue', margin: 4 }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              DeleteItem(data.item.id);
              setRefresh(!refresh)
            }}>
            <Text style={{ color: 'red', margin: 4 }}>Apagar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={Item}
        keyExtractor={(item) => item.title}
        extraData={refresh}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          height: 50,
          width: 100,
          alignSelf: 'center',
          alignItems: 'center',
          marginBottom: 40,
          borderRadius: 20,
        }}
        onPress={() => {
          navigation.navigate('Cadastro', { director });
        }}>
        <Text
          style={{
            color: 'white',
            padding: 13,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          Cadastrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List Items" component={ListItems} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '80%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
});
