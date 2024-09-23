import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, Button, FlatList, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        loadNotes();
    }, []);

    // Load notes from AsyncStorage
    const loadNotes = async() => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if (storedNotes !== null) {
                setNotes(JSON.parse(storedNotes));
            }
        } catch (error) {
            console.error('Failed to load notes.', error);
        }
    };

    // Save notes to AsyncStorage
    const saveNotes = async(newNotes) => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
        } catch (error) {
            console.error('Failed to save notes.', error);
        }
    };

    // Add a new note
    const addNote = () => {
        if (!title) {
            Alert.alert('Validation Error', 'Title cannot be empty.');
            return;
        }

        const newNote = { id: Date.now().toString(), title, content };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
        setTitle('');
        setContent('');
    };

    // Delete a note
    const deleteNote = (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
    };

    const renderNote = ({ item }) => ( <
        View style = { styles.note } >
        <
        Text style = { styles.noteTitle } > { item.title } < /Text> <
        Text > { item.content } < /Text> <
        TouchableOpacity onPress = {
            () => deleteNote(item.id) }
        style = { styles.deleteButton } >
        <
        Text style = { styles.deleteButtonText } > Delete < /Text> <
        /TouchableOpacity> <
        /View>
    );

    return ( <
        SafeAreaView style = { styles.container } >
        <
        Text style = { styles.heading } > Simple Notes App < /Text> <
        TextInput placeholder = "Title"
        value = { title }
        onChangeText = { setTitle }
        style = { styles.input }
        /> <
        TextInput placeholder = "Content"
        value = { content }
        onChangeText = { setContent }
        style = { styles.input }
        multiline /
        >
        <
        Button title = "Add Note"
        onPress = { addNote }
        /> <
        FlatList data = { notes }
        renderItem = { renderNote }
        keyExtractor = { item => item.id }
        style = { styles.list }
        /> <
        /SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    list: {
        marginTop: 20,
    },
    note: {
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#ff6347',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default App;