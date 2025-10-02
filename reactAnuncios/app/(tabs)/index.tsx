import { useState } from 'react';
import { Image, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (correo === 'admin' && contrasena === '1234') {
      Alert.alert('Sesión ingresada');
      router.push('/(tabs)/bienvenido'); 
    } else {
      Alert.alert('Credenciales incorrectas');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#a7d1ffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/anun.png')} 
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Iniciar sesión</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />
        <Button title="Iniciar sesión" onPress={handleLogin} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
reactLogo: {
  width: '110%',   
  height: 300,      
  resizeMode: 'stretch',  
  alignSelf: 'center',    
},
  input: {
    height: 40,
    borderColor: '#ff0000ff',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
