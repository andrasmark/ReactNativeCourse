import { Pressable, View, Image, Text, StyleSheet } from "react-native";

function PlaceItem({ place, onSelect }) {
  // Defensive: if no place provided, show a small placeholder to avoid crashes
  if (!place) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>No place data</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={onSelect} style={styles.container}>
      {place.imageUri ? (
        <Image source={{ uri: place.imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
      </View>
    </Pressable>
  );
}

export default PlaceItem;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  image: { width: 64, height: 64, borderRadius: 6, marginRight: 12, backgroundColor: '#eee' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#666', fontSize: 12 },
  info: { flex: 1 },
  title: { fontWeight: '600' },
  address: { color: '#666' },
  fallback: { padding: 12, alignItems: 'center' },
  fallbackText: { color: '#666' },
});

