import React, { useEffect, useState } from "react";
import { Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import gitlab from '../api/gitlab';
import { StyleSheet, View } from "react-native";

const HomeScreen = ({ navigation }) => {
    const [commits, setCommits] = useState(0)

    async function getNamesCommits() {
        let sum = 0
        let project = []
        let projects = []
        let Commits = []
        let groups = await gitlab.get('/groups');

        groups = [...groups.data.map(id => id.id)]

        for (const id of groups) {
            project = await gitlab.get(`/groups/${id}`)
            project = project.data.projects
            project.forEach(element => {
                projects = {
                    ...projects, [element.id]: {
                        name: element.name,
                    }
                }
            });
        }

        for (const id of Object.keys(projects)) {
            Commits = await gitlab.get(`/projects/${id}/repository/commits`)
            Commits = [...Commits.data]
            sum = Object.entries(Commits).length + sum
        }
        setCommits(sum)
    }


    useEffect(() => {
        getNamesCommits();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Há um total de</Text>
            <Text style={styles.textoGrande}>{commits}</Text>
            <Text style={{ ...styles.texto, textAlign: 'right' }}>commits nos projetos dos quais você faz parte do grupo.</Text>
        </View>
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
        fontSize: 80,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        padding: 15,
        textAlign: 'center'
    },
    texto: {
        flex: 1,
        fontSize: 20,
        padding: 15,
        fontWeight: 'bold',
    },
});


export default HomeScreen;
