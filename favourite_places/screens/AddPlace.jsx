import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";
import { Alert } from "react-native";

function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    try {
      console.log("Creating place:", place);
      await insertPlace(place);
      navigation.navigate("AllPlaces");
    } catch (error) {
      console.error("Error inserting place:", error);
      Alert.alert("Error", `Failed to save place: ${error.message}`);
    }
  }

  return <PlaceForm onCreatePlace={createPlaceHandler}/>;
}

export default AddPlace;
