import { CameraView, useCameraPermissions } from "expo-camera";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useRef, useState } from "react";
import {
  incrementQuestProgressForSpecificUser,
  markQuestCompleteAndUpdateUsersPoints,
} from "@/firebaseConfig";
import { useUser } from "@/hooks/useUser";
import { COLORS, COMMON_STYLES, SHADOWS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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

  if (!permission) {
    return (
      <View style={[COMMON_STYLES.container, styles.centeredContainer]}>
        <MaterialCommunityIcons
          name="camera-off"
          size={48}
          color={COLORS.primary}
        />
        <Text style={styles.permissionText}>
          Please grant camera permission to identify treasures
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => requestPermission()}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={COMMON_STYLES.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.resultContainer}>
            {isAnalyzing ? (
              <View style={styles.analyzingContainer}>
                <MaterialCommunityIcons
                  name="compass"
                  size={32}
                  color={COLORS.primary}
                  style={styles.spinningIcon}
                />
                <Text style={styles.analyzingText}>
                  Identifying treasure...
                </Text>
              </View>
            ) : (
              <View style={styles.resultTextContainer}>
                <MaterialCommunityIcons
                  name={
                    analysisResult === "None"
                      ? "close-circle"
                      : "treasure-chest"
                  }
                  size={32}
                  color={COLORS.primary}
                />
                <Text style={styles.resultText}>
                  {analysisResult === "None"
                    ? "No recyclable treasure found"
                    : `Found ${analysisResult} treasure!`}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.newPhotoButton}
              onPress={resetCamera}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={24}
                color={COLORS.background}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Search Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView style={styles.camera} ref={camera}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraGuide}>
              <MaterialCommunityIcons
                name="square-outline"
                size={250}
                color={COLORS.primary}
              />
              <Text style={styles.guideText}>
                Align your treasure within the frame
              </Text>
            </View>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureImageAsync}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    ...SHADOWS.md,
  },
  permissionButtonText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 16,
    color: COLORS.background,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
  },
  cameraGuide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guideText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 16,
    textAlign: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.primary,
    ...SHADOWS.lg,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  previewImage: {
    height: "70%",
    width: "100%",
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  analyzingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  spinningIcon: {
    marginBottom: 12,
  },
  analyzingText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 18,
    color: COLORS.primary,
  },
  resultTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  resultText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 20,
    color: COLORS.primary,
    marginLeft: 12,
  },
  newPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    ...SHADOWS.md,
  },
  buttonText: {
    fontFamily: "Kica-PERSONALUSE-Light",
    fontSize: 16,
    color: COLORS.background,
    fontWeight: "bold",
  },
});
