import React, { useEffect, useState } from "react";
import { Text } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import gitlab from '../api/gitlab';
import { StyleSheet, View } from "react-native";

const HomeScreen = ({ navigation }) => {
  const [issuesByProject, setIssuesByProject] = useState({})

  async function getNamesIssues() {
    let project = []
    let projects = []
    let issues = []
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
      issues = await gitlab.get(`/projects/${id}/issues`)
      issues = [...issues.data]
      issues.forEach(element => {
        if (element.state == 'opened')
          projects = {
            ...projects, [id]: {
              ...projects[id],
              issues: {
                ...projects[id].issues,
                [element.id]: {
                  description: element.description,
                  author: element.author.name
                }
              }
            }
          }
      });
    }
    setIssuesByProject(projects)
  }

  useEffect(() => {
    getNamesIssues();
  }, []);

  return (
    <>
      <Text style={styles.container, styles.texto}>Aqui estão listados os seus Issues em aberto dos seus grupos por projeto:</Text>
      <FlatList
        data={Object.entries(issuesByProject)}
        keyExtractor={item => item[0]}
        renderItem={item => {
          if (item.item[1].issues) {
            const name = item.item[1].name
            const issues = item.item[1].issues
            return (
             <>
                <FlatList
                  data={Object.entries(issues)}
                  keyExtractor={item => item[0]}
                  renderItem={item => {
                    return (
                      <View style={styles.container}>
                        <Text style={styles.textoPequeno}>{name}:</Text>
                        <Text style={{fontSize: 15}}>{item.item[1].author}: {item.item[1].description}</Text>
                      </View>
                    )
                  }}
                />
              </>
            )
          } else {
            <Text style={styles.textoPequeno}>Não há nada :(</Text>
          }
        }
        }
      />

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
  textoPequeno: {
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  texto: {
    fontSize: 20,
    padding: 15,
    fontWeight: 'bold',
  },
});


export default HomeScreen;
