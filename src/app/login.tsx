import { Text,TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
        <TouchableOpacity onPress={() => router.back()}>
        <Text>Voltar</Text>
      </TouchableOpacity>
    </View>
  )
}