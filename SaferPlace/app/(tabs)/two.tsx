import { useState } from "react";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import MultiUploadInput from "@/components/Outils";
import UserFormModal from "@/components/User";
import {
  UploadedFile,
  UserFormData,
  AlertVariant,
  LabelType,
} from "@/scripts/interfaces";
import Alert from "@/components/Alerte";
import LoginScreen from "@/components/UserConnection";
import { useAuth } from "@/context/AuthContex";
import EmergencyModal from "@/components/Verification";
import ChatBot from "@/components/ChatBot";
import EmergencyButton from "@/components/Emergencies";

export default function TabTwoScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [verifVisible, setVerifVisible] = useState(false);
  const [label, setLabel] = useState<LabelType>("not_toxic");
  const [accuracy, setAccuracy] = useState(0);
  const [title, setTitle] = useState("");
  const [variant, setVariant] = useState<AlertVariant>("success");
  const [message, setMessage] = useState("");
  const { userInfo } = useAuth();

  //text submission
  const handleSubmit = async (texts: string, file?: UploadedFile) => {
    if (texts) {
      await fetch("https://toxicityrecognition.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: texts }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setLabel(data.label);
          setAccuracy(data.accuracy);
          setVerifVisible(true);
        })
        .catch((error) => console.error("Error:", error));
    }
    if (file) {
      //audi file verification
      console.log("File uploaded:", file.name);

      if (file.type === "audio") {
        const formData = new FormData();

        //add file to form
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: "audio/mpeg",
        } as any);
        try {
          const response = await fetch(
            "https://toxicityrecognition.onrender.com/audio_predict",
            {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            }
          );

          const data = await response.json();
          console.log(data);

          if (response.ok) {
            setLabel(data.label);
            setAccuracy(data.accuracy);
            setVerifVisible(true);
          } else {
            console.error("Upload failed:", data);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  //function to add a user
  const addUser = async (user: UserFormData) => {
    if (user.name && user.email && user.password && user.phone) {
      try {
        const response = await fetch(
          "https://saferplaceserver.onrender.com/add_user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );
        const data = await response.json();
        console.log("User added:", data);
        if (data.status === "user added") {
          setAlertVisible(true);
          setTitle("Success");
          setVariant("success");
          setMessage("User added successfully");
        }
        if (data.status === "user already exists") {
          setAlertVisible(true);
          setTitle("Warning");
          setVariant("warning");
          setMessage("This email is already in use");
        }
      } catch (error) {
        console.error("Failed to add user:", error);
        setAlertVisible(true);
        setTitle("Warning");
        setVariant("warning");
        setMessage("Failed to add user");
      }
    } else {
      setAlertVisible(true);
      setTitle("Error");
      setVariant("error");
      setMessage("Please fill all fields");
    }
  };
  return (
    <View style={styles.container}>
      {/** Buton to add a user appears only when no user is connected */}
      {!userInfo && (
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Button
            title="New User"
            color={"#44d575"}
            onPress={() => setModalVisible(true)}
          />

          <UserFormModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={addUser}
          />
        </View>
      )}
      {userInfo && (
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <EmergencyButton/>
        </View>
      )}
      <View style={{ flex: 1, alignItems: "center" }}>
        {/* Shows the connected user's name  */}
        {userInfo && <Text style={styles.title}>Hello {userInfo.name}</Text>}
        {!userInfo && <Text style={styles.title}>Hello User</Text>}
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Login to use all the features of the app
        </Text>
        <TouchableOpacity
          onPress={() => setLoginVisible(true)}
          style={{ flexDirection: "row", justifyContent: "center" }}
        >
          <Text
            style={styles.getStartedText}
            lightColor="rgb(36, 160, 11)"
            darkColor="rgba(255,255,255,0.8)"
            selectionColor={"#9ee58e"}
          >
            Sign-in Here
          </Text>
          <FontAwesome5 name="hand-point-left" size={24} color="#9ee58e" />
          <LoginScreen
            visible={loginVisible}
            onClose={() => setLoginVisible(false)}
          />
        </TouchableOpacity>
        <ChatBot />
      </View>
      {/* Multiupload form for user to enter text document or audio to be verified */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {userInfo && userInfo.authorization === "true" && (
          <MultiUploadInput onSubmit={handleSubmit} />
        )}
        {userInfo && userInfo.authorization === "false" && (
          <Text style={styles.getStartedText}>
            We need your authorization to verify your messages
          </Text>
        )}
      </View>
      {/** Alert component shown when the request is successful */}
      {alertVisible && (
        <Alert
          title={title}
          variant={variant}
          message={message}
          duration={5000}
          onDismiss={() => setAlertVisible(false)}
        />
      )}
      {/** Emergency Modal shown when the text is toxic or not */}
      <EmergencyModal
        visible={verifVisible}
        onClose={() => setVerifVisible(false)}
        label={label}
        accuracy={accuracy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginEnd: 10,
  },
});
