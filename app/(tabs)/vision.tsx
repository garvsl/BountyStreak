import { CameraView, useCameraPermissions } from 'expo-camera';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRef } from 'react';

export default function Vision() {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);

  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Getting width and height of the screen
  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

  // Requesting permission to use the camera
  if (!permission?.granted) requestPermission();

  // Capturing image
  const captureImageAsync = async () => {
    if (!camera.current) return;
    try {
      const imageData = await camera.current.takePictureAsync({
        quality: 0.8, // Reduced quality
        base64: true,
      });
      if (!imageData || !imageData.base64) throw new Error("No image data captured");
      const prompt = "This image contains either 'Glass', 'Plastic', 'Cardboard', or 'None'. Please identify the primary subject of the image into one of the previously specified categories.";
      const generatedResponse = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.base64,
          },
        },
      ]);

      console.log("Result:", generatedResponse.response.text())
    } catch (error) {
      console.error('Error capturing or processing image:', error);
    }
  };

  return (
    <View style={styles.main}>
      {permission ? (
        <CameraView
          ratio="16:9"
          style={{ ...styles.camera, height: height, width: '100%' }}
          ref={camera}
          onCameraReady={() => {if(!permission) requestPermission()}}
        >
          <View style={styles.bottomCamera}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={captureImageAsync}
            />
          </View>
        </CameraView>
      ) : (
        <View>
          <Text>Please provide camera permission.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  bottomCamera: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 30,
    backgroundColor: 'transparent',
  },
  button: {
    width: 50,
    height: 50,
    margin: 15,
    borderRadius: 50,
    backgroundColor: '#EDF1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 70,
    height: 70,
    bottom: 15,
    borderRadius: 50,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
