import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function RegistroScreen() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarUsuario = () => {
    // 👇 USA TU URL DE NGROK
    const url = 'https://thromboplastically-echolalic-january.ngrok-free.dev/usuarios';

    console.log("Conectando a:", url);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // 👇 Headers específicos para ngrok free
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        correo: correo,
        contrasena: contrasena
      })
    })
    .then(async (response) => {
      console.log("Status:", response.status);
      console.log("OK:", response.ok);
      
      const rawText = await response.text();
      console.log("Respuesta cruda:", rawText);
      
      try {
        const data = JSON.parse(rawText);
        console.log("JSON parseado:", data);
        
        if (data.success) {
          setMensaje("✅ Usuario registrado con ID: " + data.id);
          setCorreo("");
          setContrasena("");
          router.push('/(tabs)/bienvenido'); 
        } else {
          setMensaje("❌ Error: " + (data.message || data.error));
        }
      } catch (e) {
        console.error("Error parseando JSON:", e);
        setMensaje("⚠ Respuesta inválida del servidor: " + rawText.substring(0, 50));
      }
    })
    .catch(err => {
      console.error("Error de conexión:", err);
      setMensaje("🔌 No se pudo conectar con el servidor");
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