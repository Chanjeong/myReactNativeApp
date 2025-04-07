import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { theme } from './../../colors';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

type ToDoItem = {
  text: string;
  working: boolean;
  completed: boolean;
};

const STORAGE_KEY = '@toDos';
const STATE = '@state';

export default function App() {
  const [working, setWorking] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [toDos, setToDos] = useState<Record<string, ToDoItem>>({});
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const travel = () => {
    setWorking(false);
    saveState(false);
  };
  const work = () => {
    setWorking(true);
    saveState(true);
  };

  const onChangeText = (payload: string) => setText(payload);

  useEffect(() => {
    (async () => {
      await loadToDos();
      await loadState();
      setLoading(false);
    })();
  }, []);

  const saveState = async (state: boolean) => {
    await AsyncStorage.setItem(STATE, JSON.stringify(state));
  };

  const loadState = async () => {
    const state = await AsyncStorage.getItem(STATE);
    if (state !== null) {
      setWorking(JSON.parse(state));
    }
  };

  const saveTodos = async (toSave: any) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s ?? '{}'));
    } catch (e) {
      console.log(e);
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, completed }
    };
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText('');
  };

  const deleteToDo = (key: any) => {
    Alert.alert('투두 삭제하기', '삭제 하시렵니까?', [
      { text: '취소' },
      {
        text: '네',
        style: 'destructive',
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveTodos(newToDos);
        }
      }
    ]);
  };

  const toggleComplete = async (key: string) => {
    const newToDos = { ...toDos };
    newToDos[key].completed = !newToDos[key].completed;
    setToDos(newToDos);
    await saveTodos(newToDos);
  };

  const startEditing = (key: string) => {
    setEditingKey(key);
    setEditedText(toDos[key].text);
  };

  const saveEdit = async () => {
    if (!editingKey) return;
    const newToDos = { ...toDos };
    newToDos[editingKey].text = editedText;
    setToDos(newToDos);
    await saveTodos(newToDos);
    setEditingKey(null);
    setEditedText('');
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' }
        ]}>
        <ActivityIndicator size="large" color={'tomato'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? 'white' : theme.grey
            }}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey
            }}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={
          working ? 'What do you have to do?' : 'Where do you want to go?'
        }
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map(key =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <TouchableOpacity onPress={() => toggleComplete(key)}>
                <Fontisto
                  name={
                    toDos[key].completed
                      ? 'checkbox-active'
                      : 'checkbox-passive'
                  }
                  size={18}
                  color="white"
                />
              </TouchableOpacity>
              {editingKey === key ? (
                <TextInput
                  value={editedText}
                  onChangeText={setEditedText}
                  onSubmitEditing={saveEdit}
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginVertical: 0,
                      fontSize: 16,
                      marginHorizontal: 10
                    }
                  ]}
                />
              ) : (
                <Text
                  style={[
                    styles.toDoText,
                    toDos[key].completed && {
                      textDecorationLine: 'line-through',
                      color: '#bbb'
                    }
                  ]}>
                  {toDos[key].text}
                </Text>
              )}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => startEditing(key)}>
                  <Text>D</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.grey} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'white'
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10
  }
});
