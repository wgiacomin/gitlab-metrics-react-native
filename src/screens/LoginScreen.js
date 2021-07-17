import React, { useContext, useState, useEffect, useRef } from "react";
import { Image, View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Input, Button } from "react-native-elements";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation, route }) => {
    const input_2 = useRef(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { authState, signIn, tryLocalSignIn, logout } = useContext(AuthContext);

    useEffect(() => {
        if(route?.params?.logout) {
            logout()
        }
    }, [route.params]);


    useEffect(() => {
        tryLocalSignIn();
    }, []);

    return (
        <ImageBackground
            style={styles.background}
            source={require('../images/background.png')}>
            <View style={styles.container}>
                <View style={styles.itensStand}>
                    <Image
                        style={styles.logo}
                        source={require('../images/gitlab.png')}
                    />
                </View>
                <View style={styles.inputbox}>
                    <Text style={styles.texto}>
                        Bem-vindo!
                    </Text>
                    <Input
                        placeholder="Usuário"
                        onChangeText={(value) => setUsername(value)}
                        value={username}
                        style={styles.input}
                        inputStyle={{ padding: 7, paddingLeft: 15, fontSize: 16 }}
                        onSubmitEditing={() => input_2.current.focus()}
                    />
                    <Input
                        placeholder="Senha"
                        ref={input_2}
                        onChangeText={(value) => setPassword(value)}
                        value={password}
                        secureTextEntry={true}
                        style={styles.input}
                        inputStyle={{ padding: 7, paddingLeft: 15, fontSize: 16 }}
                    />

                    <Button
                        title="Entrar"
                        onPress={() => {
                            signIn({ username, password });
                        }}
                        buttonStyle={styles.button}
                        titleStyle={{ fontSize: 16 }}
                    />
                    {authState.error ? <Text style={styles.textoPequeno}>{authState.error}</Text> : null}
                </View>
                <Text style={styles.textoPequeno}>
                    Esqueceu a senha?
                </Text>
            </View>
        </ImageBackground >

    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        padding: 20,
    },
    logo: {
        alignSelf: 'center',
        width: 100,
        height: 100,
    },
    background: {
        flex: 1,
    },
    itensStand: {
        flex: 0.4,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    inputbox: {
        flex: 1,
    },
    texto: {
        color: 'white',
        fontSize: 30,
        paddingLeft: 10,
        paddingBottom: 15,
        fontFamily: 'Roboto'
    },
    textoPequeno: {
        color: 'white',
        fontSize: 15,
        paddingLeft: 10,
        paddingBottom: 15,
        // fontFamily: 'Roboto',
        alignSelf: 'center'
    },
    input: {
        borderRadius: 10,
        backgroundColor: 'lightgray',
    },
    button: {
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#CC5500',
    }
});