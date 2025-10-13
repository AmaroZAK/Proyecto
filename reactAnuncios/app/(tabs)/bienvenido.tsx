import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform, Button} from 'react-native';

type LoginRow = {
  correo: string;
  contrasena: string;
};

// Emulador Android: 10.0.2.2
// iOS simulator: localhost
// Celular físico: cambia por la IP LAN de tu PC (ej. http://192.168.1.8:3000)
const API_BASE =
  Platform.OS === 'android' ? 'http://192.168.1.9:3000' : 'http://localhost:3000';
// const API_BASE = 'http://192.168.1.8:3000'; // <- usa esto si pruebas en celular físico

export default function HomePage() {
  const [usuarios, setUsuarios] = useState<LoginRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendientes, setPendientes] = useState<Record<string, boolean>>({});
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
 const EliminarUsuario = async (correo: string) => {
  try {
    const resp = await fetch(`${API_BASE}/usuarios/${encodeURIComponent(correo)}`, {
      method: 'DELETE',
    });
    const json = await resp.json();
    if (!resp.ok || !json.success) {
      alert(json.message || 'No se pudo eliminar');
      return;
    }
    // Vuelve a cargar la lista o filtra el estado local
/*     setUsuarios(prev => prev.filter(u => u.correo !== correo)); */
   setPendientes(prev => ({ ...prev, [correo]: true }));
  } catch (e) {
    console.error(e);
    alert('Error de red al eliminar');
  }
   
};

const Update = async (correo: string) => {
  setRefreshing(true);
  await fetchUsuarios(); // recarga desde BD
  setPendientes(prev => {
    const next = { ...prev };
    delete next[correo]; // limpia solo este correo
    return next;
  });
};


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
  // ---------- INTERFAZ VISUAL ----------
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabla: login</Text>
        {Object.keys(pendientes).length > 0 && (
          <Text style={styles.alertText}>
            Cambios pendientes → <Text style={styles.alertHighlight}>pulsa “Actualizar”</Text>
          </Text>
        )}
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.correo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cell}>
              <Text style={styles.label}>Correo: </Text>
              {item.correo}
            </Text>
            <Text style={styles.cell}>
              <Text style={styles.label}>Contraseña: </Text>
              {item.contrasena}
            </Text>

            <View style={styles.buttonRow}>
              <Button
                title="Eliminar"
                onPress={() => EliminarUsuario(item.correo)}
                color="#1D4ED8" // azul fuerte
              />
              <View style={{ width: 12 }} />
              <Button
                title="Actualizar"
                onPress={() => Update(item.correo)}
                color={pendientes[item.correo] ? '#16A34A' : '#9CA3AF'} // verde si activo, gris si no
                disabled={!pendientes[item.correo]}
              />
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24, width: '100%' }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay registros.</Text>}
      />
    </View>
  );
}

// ---------- ESTILOS ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // fondo gris suave
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  alertText: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
  },
  alertHighlight: {
    fontWeight: '700',
    color: '#B45309',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cell: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 6,
  },
  label: {
    fontWeight: '700',
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  sep: {
    height: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 16,
  },
});