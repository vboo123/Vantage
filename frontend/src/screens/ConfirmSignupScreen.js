import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { confirmSignUp } from 'aws-amplify/auth';

const ConfirmSignupScreen = ({ route, navigation }) => {
    const { email: initialEmail } = route.params || {};
    const [email, setEmail] = useState(initialEmail || '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            Alert.alert('Success', 'Account verified! You can now sign in.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Confirmation Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirm Account</Text>
            <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Confirmation Code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
            />

            <Button title={loading ? "Verifying..." : "Confirm"} onPress={handleConfirm} disabled={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
    },
});

export default ConfirmSignupScreen;
