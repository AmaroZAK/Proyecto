import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";

export default function RegistroScreen() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarUsuario = () => {
    // 👇 URL CORRECTA PARA ANDROID
    const url = Platform.OS === 'android' 
      ? 'http://10.0.2.2:3000/usuarios' 
      : 'http://localhost:3000/usuarios';

    console.log("Conectando a:", url); // Para debug

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo: correo,
        contrasena: contrasena
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMensaje("✅ Usuario registrado con ID: " + data.id);
          setCorreo("");
          setContrasena("");
        } else {
          setMensaje("❌ Error: " + (data.message || data.error));
        }
      })
      .catch(err => {
        console.error("Error de conexión:", err);
        setMensaje("⚠ No se pudo conectar con el servidor");
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#999"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />
      <Button title="Registrar" onPress={registrarUsuario} />
      {mensaje !== "" && <Text style={styles.mensaje}>{mensaje}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "white"
  },
  mensaje: {
    marginTop: 15,
    fontSize: 16,
    color: "white"
  }
});