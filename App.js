import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from './ToDo.js'
import { AppLoading } from 'expo'
import uuidv1 from 'uuid/v4'

const {width} = Dimensions.get('window');

export default class App extends React.Component{
  state = {
    newTODO: "",
    loadedToDos: false,
    ToDos: {}
  };
  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const {newTODO, loadedToDos, ToDos} = this.state;
    if(!loadedToDos){
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar style='auto' />
        <Text style={styles.title}>To do List</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.Input} 
            placeholder={'New to do'} 
            value={newTODO} 
            onChangeText={this._controlNewToDo} 
            placeholderTextColor={'#999'} 
            returnKeyType={'done'} 
            autoCorrect={false} 
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.ToDos}>
            {Object.values(ToDos).reverse().map(toDo => <ToDo 
                                                key={toDo.id} 
                                                {...toDo} 
                                                deleteToDo={this._deleteToDo} 
                                                comToDo={this._completeToDo} 
                                                uncomToDo={this._uncompleteToDo} 
                                                updateToDo={this._updateToDo}
                                              />)}
          </ScrollView>
        </View>
      </View>
    );
  };
  _controlNewToDo = text => {
    this.setState({
      newTODO: text
    });
  };
  _loadToDos = async () => {
    try {
      const ToDos = await AsyncStorage.getItem("todo");
      const parsedToDos = JSON.parse(ToDos);
      this.setState({
        loadedToDos: true,
        ToDos: parsedToDos || {}
      });
    }catch(err){
      // console.log(err);
    }
  };
  _addToDo = () => {
    const {newTODO} = this.state;
    if(newTODO != ''){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoobject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTODO,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTODO: '',
          ToDos: {
            ...prevState.ToDos,
            ...newToDoobject
          }
        };
        this._saveToDo(newState.ToDos);
        return {...newState};
      });
      this.setState({
        newTODO: ''
      });
    }
  };
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const ToDos = prevState.ToDos;
      delete ToDos[id];
      const newState = {
        ...prevState,
        ...ToDos
      };
      this._saveToDo(newState.ToDos);
      return {...newState};
    });
  };
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        ToDos: {
          ...prevState.ToDos,
          [id]: {
            ...prevState.ToDos[id],
            iscompleted: false
          }
        }
      };
      this._saveToDo(newState.ToDos);
      return {...newState};
    });
  };
  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        ToDos: {
          ...prevState.ToDos,
          [id]: {
            ...prevState.ToDos[id],
            iscompleted: true
          }
        }
      };
      this._saveToDo(newState.ToDos);
      return {...newState};
    });
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        ToDos: {
          ...prevState.ToDos,
          [id]: {
            ...prevState.ToDos[id],
            text: text
          }
        }
      };
      this._saveToDo(newState.ToDos);
      return {...newState};
    });
  };
  _saveToDo = (newtodo) => {
    const savetodo = AsyncStorage.setItem('todo', JSON.stringify(newtodo));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightcoral',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 50,
    fontWeight: '700',
    marginBottom: 25,
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 50,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: 'black',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 50
      }
    })
  },
  Input: {
    padding: 20,
    ...Platform.select({
      android: {
        paddingLeft: 20
      }
    }),
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25
  },
  ToDos: {
    alignItems: 'center'
  }
});
