import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, TextInput} from 'react-native';
import PropTypes from 'prop-types'

const {width} = Dimensions.get('window');

export default class ToDo extends React.Component{
    static propTypes = {
        text: PropTypes.string.isRequired,
        iscompleted: PropTypes.bool,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        comToDo: PropTypes.func.isRequired,
        uncomToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }
    state = {
        isediting: false,
        ToDovalue: ''
    }
    render() {
        const {isediting, ToDovalue} = this.state;
        const {text, id, deleteToDo, iscompleted} = this.props;
        return(
        <View style={styles.container}>
            <View style={styles.column}>
                <TouchableOpacity onPress={this._TogglecompleteToDo}>
                    <View style={[styles.circle, iscompleted ? styles.CompletedCircle : styles.UncompletedCircle]}>
                    </View>
                </TouchableOpacity>
                {isediting ? (
                <TextInput style={styles.Inputstyle, 
                    iscompleted ? styles.completedText : styles.uncompletedText} 
                    value={ToDovalue} 
                    multiline={true} 
                    onChangeText={this._controlInput} 
                    returnKeyType={'done'} 
                    onBlur={this._finishEditing}
                />
                ) : (
                <Text style={
                    [styles.texts, 
                    iscompleted ? styles.completedText : styles.uncompletedText]}>{text}
                </Text>)}
            </View>
            {isediting ? (
                <View style={styles.actions}>
                    <TouchableOpacity onPressOut={this._finishEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>✅</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.actions}>
                    <TouchableOpacity onPressOut={this._startEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>📝</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPressOut={(event) => {event.stopPropagation(); deleteToDo(id)}}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>❌</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
        );
    };
    _TogglecompleteToDo = (event) => {
        event.stopPropagation()
        const {iscompleted, comToDo, uncomToDo, id} = this.props;
        if(iscompleted){
            uncomToDo(id);
        }else{
            comToDo(id);
        }
    };
    _startEditing = (event) => {
        event.stopPropagation()
        const {text} = this.props;
        this.setState({
            isediting: true,
            ToDovalue: text
        });
    };
    _finishEditing = (event) => {
        event.stopPropagation()
        const {ToDovalue} = this.state;
        const {id, updateToDo} = this.props;
        updateToDo(id, ToDovalue);
        this.setState({
            isediting: false
        });
    };
    _controlInput = (text) => {
        this.setState({
            ToDovalue: text
        })
    };
}

const styles = StyleSheet.create({
    container: {
        width: width - 70,
        borderBottomColor: '#bbb',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    CompletedCircle: {
        borderColor: '#bbb'
    },
    UncompletedCircle: {
        borderColor: 'coral'
    },
    completedText: {
        color: '#bbb',
        textDecorationLine: 'line-through',
        fontWeight: '600',
        fontSize: 20,
        marginVertical: 20
    },
    uncompletedText: {
        color: '#3f3f3f',
        fontWeight: '600',
        fontSize: 20,
        marginVertical: 20
    },
    texts: {
        fontWeight: '600',
        fontSize: 20,
        marginVertical: 20
    },
    circle: {
        width: 30, 
        height: 30,
        borderRadius: 15,
        borderColor: 'coral',
        borderWidth: 3,
        marginRight: 10
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width / 2
    },
    actions: {
        flexDirection: 'row'
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    Inputstyle: {
        marginVertical: 15,
        width: width /2,
        paddingBottom: 5
    }
})