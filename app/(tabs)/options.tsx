import { Text, View, StyleSheet } from 'react-native';

export default function OptionsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Options screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7393B3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
