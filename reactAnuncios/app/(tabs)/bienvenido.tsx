import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform } from 'react-native';

type LoginRow = {
  correo: string;
  contrasena: string;
};

// Emulador Android: 10.0.2.2
// iOS simulator: localhost
// Celular físico: cambia por la IP LAN de tu PC (ej. http://192.168.1.8:3000)
const API_BASE =
  Platform.OS === 'android' ? 'http://192.168.1.8:3000' : 'http://localhost:3000';
// const API_BASE = 'http://192.168.1.8:3000'; // <- usa esto si pruebas en celular físico

export default function HomePage() {
  const [usuarios, setUsuarios] = useState<LoginRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      setError(null);
      console.log('➡️ GET', `${API_BASE}/usuarios`);
      const resp = await fetch(`${API_BASE}/usuarios`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      console.log('⬅️ RESP', json);

      if (json?.success && Array.isArray(json?.data)) {
        setUsuarios(json.data);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (e: any) {
      setError(e?.message || 'Error de red');
      console.error('❌ Error fetcheando /usuarios:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsuarios();
  }, [fetchUsuarios]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando usuarios…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabla: login</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.correo}        // 👈 usa correo como key
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}><Text style={styles.label}>Correo:</Text> {item.correo}</Text>
            <Text style={styles.cell}><Text style={styles.label}>Contraseña:</Text> {item.contrasena}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24, width: '100%' }}
        ListEmptyComponent={<Text>No hay registros.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: { padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fafafa' },
  cell: { fontSize: 16, marginBottom: 6 },
  label: { fontWeight: 'bold' },
  sep: { height: 10 },
});
