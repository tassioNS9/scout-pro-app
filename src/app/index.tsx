import { router } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function App() {
  return (
    <View>
      <Text>Olá mundo!</Text>
      <TouchableOpacity onPress={() => router.push('login')}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}