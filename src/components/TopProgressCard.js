import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function TopProgressCard() {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.value}>120</Text>
        <Text style={styles.label}>XP total</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.value}>5</Text>
        <Text style={styles.label}>dias</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.value}>2</Text>
        <Text style={styles.label}>nível</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 30,
  },

  item: {
    flex: 1,
    alignItems: 'center',
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E7DFD2',
  },

  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#497D52',
  },

  label: {
    marginTop: 4,
    color: '#777',
  },
});