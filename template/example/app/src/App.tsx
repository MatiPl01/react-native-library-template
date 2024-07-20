import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Greeting } from '{{library-name}}';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Greeting />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
