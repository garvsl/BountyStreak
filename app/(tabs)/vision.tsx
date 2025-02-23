import { CameraView, useCameraPermissions } from "expo-camera";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import { useRef, useState } from "react";
import {
  incrementQuestProgressForSpecificUser,
  markQuestCompleteAndUpdateUsersPoints,
} from "@/firebaseConfig";
import { useUser } from "@/hooks/useUser";

// Quest mapping for material types
interface Quest {
  id: string;
  questName: string;
  currentProgress: number;
  maxProgress: number;
  completed: boolean;
  rewardInDoubloons: number;
}

const MATERIAL_TO_QUEST = {
  Plastic: "Recycle Plastic",
  Glass: "Recycle Glass",
  Cardboard: "Recycle Cardboard",
  Bottle: "Recycle Bottles",
} as const;

type MaterialType = keyof typeof MATERIAL_TO_QUEST | "None";

const VISION_PROMPT = `
Analyze this image and categorize the main recyclable item shown. 
Choose EXACTLY ONE of these categories: 'Glass', 'Plastic', 'Cardboard', 'Bottle', 'None'.
Requirements:
- Select 'None' if no clear recyclable item is visible
- Choose the most specific category that applies
- For bottles, categorize as:
  * 'Glass' if it's clearly a glass bottle
  * 'Plastic' if it's clearly a plastic bottle
  * 'Bottle' if the material is unclear
- Look for distinctive features:
  * Glass: transparent, rigid, typically has a distinctive shine
  * Plastic: flexible, matte or slight sheen, visible seams
  * Cardboard: brown/beige color, visible fiber texture, folds/creases
Return ONLY the category name, nothing else.
`;

export default function Vision() {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { user, setQuests, localQuests, setLocalQuests } = useUser();

  if (!permission?.granted) requestPermission();

  const resetCamera = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };

  const handleQuestProgress = async (material: MaterialType) => {
    if (material === "None") return;

    const questName = MATERIAL_TO_QUEST[material];
    const questToUpdate = localQuests.find((q) => q.questName === questName);

    if (!questToUpdate || questToUpdate.completed) return;

    try {
      await incrementQuestProgressForSpecificUser(user.uid, questName);

      const updatedQuests = localQuests.map((quest) => {
        if (quest.questName === questName) {
          const newProgress = quest.currentProgress + 1;
          return {
            ...quest,
            currentProgress: newProgress,
            completed: newProgress >= quest.maxProgress,
          };
        }
        return quest;
      });

      setLocalQuests(updatedQuests);

      setQuests((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating quest progress:", error);
    }
  };

  const captureImageAsync = async () => {
    if (!camera.current) return;
    try {
      const imageData = await camera.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (!imageData || !imageData.base64)
        throw new Error("No image data captured");

      setCapturedImage(`data:image/jpeg;base64,${imageData.base64}`);
      setIsAnalyzing(true);

      const generatedResponse = await model.generateContent([
        VISION_PROMPT,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.base64,
          },
        },
      ]);

      const result = generatedResponse.response.text().trim() as MaterialType;
      setAnalysisResult(result);

      await handleQuestProgress(result);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error capturing or processing image:", error);
      setIsAnalyzing(false);
      setAnalysisResult("Error analyzing image");
    }
  };

  return (
    <View style={styles.main}>
      {permission ? (
        <>
          {capturedImage ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: capturedImage }}
                style={{ height: "78%", width: "100%" }}
              />
              <View style={styles.resultContainer}>
                {isAnalyzing ? (
                  <Text style={styles.loadingText}>Analyzing image...</Text>
                ) : (
                  <Text style={styles.resultText}>{analysisResult}</Text>
                )}
                <TouchableOpacity
                  style={styles.newPhotoButton}
                  onPress={resetCamera}
                >
                  <Text style={styles.buttonText}>Take New Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <CameraView
              ratio="16:9"
              style={{ ...styles.camera, height: "100%", width: "100%" }}
              ref={camera}
              onCameraReady={() => {
                if (!permission) requestPermission();
              }}
            >
              <View style={styles.bottomCamera}>
                <TouchableOpacity
                  style={styles.shutterButton}
                  onPress={captureImageAsync}
                />
              </View>
            </CameraView>
          )}
        </>
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
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    alignSelf: "stretch",
    flexDirection: "column",
  },
  bottomCamera: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    columnGap: 30,
    backgroundColor: "transparent",
  },
  previewContainer: {
    flex: 1,
    width: "100%",
  },
  resultContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 20,
  },
  resultText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  newPhotoButton: {
    backgroundColor: "#EDF1D6",
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  shutterButton: {
    width: 70,
    height: 70,
    bottom: 45,
    borderRadius: 50,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
