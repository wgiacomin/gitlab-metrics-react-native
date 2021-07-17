import React, { useEffect, useState } from "react";
import { Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import gitlab from '../api/gitlab';
import { StyleSheet, View } from "react-native";

const HomeScreen = ({ navigation }) => {
    const [projects, setProjects] = useState(0)
    const [names, setNames] = useState([])

    async function getNamesIssues() {
        let sum = 0
        let project = []
        let projects = []
        let issues = []
        let groups = await gitlab.get('/groups');

        groups = [...groups.data.map(id => id.id)]

        for (const id of groups) {
            project = await gitlab.get(`/groups/${id}`)
            project = project.data.projects
            project.forEach(element => {
                projects = [
                    ...projects,
                    element.name,
                ]
                sum = sum + 1
            });
        }
        setNames(projects)
        setProjects(sum)
    }


    useEffect(() => {
        getNamesIssues();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.texto}>Há um total de</Text>
                <Text style={styles.textoGrande}>{projects}</Text>
                <Text style={{ ...styles.texto, textAlign: 'right' }}>projetos dos quais você faz parte do grupo.</Text>
            </View>
            <View style={{...styles.container, flex: 0.7}}>
                <Text style={{ ...styles.texto, flex: 0, fontSize: 15 }}>Confira a lista:</Text>
                <FlatList
                    data={names}
                    keyExtractor={item => item}
                    renderItem={({ item }) => {
                        return (
                            <>
                            <Text style={styles.textPequeno}>{item}</Text>
                            </>
                        )
                    }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        padding: 15,
    },
    textoGrande: {
        flex: 1,
        fontSize: 60,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        padding: 15,
        textAlign: 'center'
    },
    texto: {
        flex: 1,
        fontSize: 18,
        padding: 15,
        fontWeight: 'bold',
    },
    textPequeno: {
        fontSize: 14,
        padding: 15,
        paddingVertical: 0
    },
});


export default HomeScreen;
