import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useUser } from '../context/UserContext';
import logo from '../assets/logo.png';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const { login } = useUser();



const handleLogin = async () => {
  const success = await login(email, password);
  if (success) {
    navigation.navigate('HomeTabs');
  } else {
    setError('El usuario o la contraseña son incorrectos');
  }
};



  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Flavor Feast</Text>
      <Text style={styles.subtitle}>A Symphony of Tastes</Text>

      <TextInput
        placeholder="Email"
        style={[styles.input, error && styles.inputError]}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={[styles.input, error && styles.inputError]}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => Alert.alert('Pantalla olvidaste tu contraseña pendiente')}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fefefe',
  },
  subtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: '#B59A51',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linksRow: {
    alignItems: 'center',
    gap: 10,
  },
  link: {
    color: '#555',
  },
  linkBold: {
    color: '#000',
    fontWeight: 'bold',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#23294c',
  },
});

export default LoginScreen;
