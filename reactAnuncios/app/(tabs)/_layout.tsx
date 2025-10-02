import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Pantalla principal */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
