import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import uuid from "react-native-uuid";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDswSWoS_bi_5qGWQHekRGG1VzAyy_ho5s",
  authDomain: "bounty-streak-59f86.firebaseapp.com",
  projectId: "bounty-streak-59f86",
  storageBucket: "bounty-streak-59f86.firebasestorage.app",
  messagingSenderId: "888983731303",
  appId: "1:888983731303:web:b3d41d2008171d1fa9e8c2",
  measurementId: "G-78EP3K988E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app); doesnt work idk why

// TEST
const db = getFirestore();
const userRefs = collection(db, "User");

export async function getAllUsers() {
  try {
    const usersRef = collection(db, "User");
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

export async function getUsersSortedByDoubloons() {
  try {
    const usersRef = collection(db, "User");
    const q = query(usersRef, orderBy("doubloons", "desc")); // descending
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("error bruh: ", error);
    return [];
  }
}

export async function getUserByUid(uid) {
  try {
    const usersRef = collection(db, "User");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // User not found
    }

    // Return the first matching document
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error("Error getting user by UID: ", error);
    return null;
  }
}

export async function buyPetItem(userId, itemName) {
  // Reference to the user's document in User collection
  const userDocRef = doc(db, "User", userId);

  try {
    // Fetch user data from User collection
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentDoubloons = userData.doubloons || 0; // Default to 0 if not set
      const petPirate = userData.petPirate || []; // Default to empty array if not set
      // Check if the item is already in the petPirate array
      if (petPirate.includes(itemName)) {
        console.log(
          `User ${userId} already has the ${itemName} for their pet.`
        );
        return; // Exit the function if the item has already been purchased
      }

      // Query ShopItem collection to find the item by itemName
      const q = query(
        collection(db, "ShopItem"),
        where("itemName", "==", itemName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const itemDoc = querySnapshot.docs[0];
        const itemData = itemDoc.data();
        const itemCost = itemData.cost;

        // Check if the user has enough doubloons to buy the item
        if (currentDoubloons >= itemCost) {
          // Deduct doubloons and add item to petPirate
          const newDoubloons = currentDoubloons - itemCost;

          // Update the user document with the new doubloons and add item to petPirate
          await updateDoc(userDocRef, {
            doubloons: newDoubloons,
            petPirate: [...petPirate, itemName], // Add item to petPirate array
          });

          console.log(
            `User ${userId} successfully bought the ${itemName} for their pet.`
          );
        } else {
          console.log(
            `User ${userId} doesn't have enough doubloons to buy ${itemName}.`
          );
        }
      } else {
        console.log(`Item ${itemName} not found in the shop.`);
      }
    } else {
      console.log(`User with ID: ${userId} not found!`);
    }
  } catch (error) {
    console.error("Error buying pet item:", error);
  }
}

export async function getCurrentStreak(userId) {
  const userDocRef = doc(db, "User", userId); // Get a reference to the user's document

  try {
    const userDoc = await getDoc(userDocRef); // Fetch the document
    if (userDoc.exists()) {
      const userData = userDoc.data(); // Get document data
      const currentStreak = userData.currentStreak; // Access the 'currentStreak' field
      console.log(`Current streak for user ${userId}: ${currentStreak}`);
      return currentStreak; // Return the streak value
    } else {
      console.log(`No such user with ID: ${userId}`);
      return null; // User not found
    }
  } catch (error) {
    console.error("Error getting user document:", error);
    return null; // Error occurred
  }
}

export async function listPetItems(userId) {
  // Reference to the user's document in the 'User' collection
  const userDocRef = doc(db, "User", userId);

  try {
    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const petPirateItems = userData.petPirate || []; // Default to empty array if no items are found

      // List the items the pet has
      if (petPirateItems.length > 0) {
        console.log(
          `Pet has the following items: ${petPirateItems.join(", ")}`
        );
      } else {
        console.log(`Pet has no items.`);
      }
    } else {
      console.log(`User with ID: ${userId} not found!`);
    }
  } catch (error) {
    console.error("Error listing pet items:", error);
  }
}

export async function getCompletedQuests(userId) {
  const userDocRef = doc(db, "users", userId); // Reference to the user's document
  const usersQuestRef = collection(userDocRef, "usersQuest"); // Reference to the 'usersQuest' subcollection

  try {
    // Fetch all quests from the 'usersQuest' subcollection
    const querySnapshot = await getDocs(
      query(usersQuestRef, where("completed", "==", true))
    );

    // Check if any completed quests were found
    if (querySnapshot.empty) {
      console.log(`User ${userId} has not completed any quests.`);
    } else {
      console.log(`User ${userId} has completed the following quests:`);

      // Loop through the querySnapshot and print each completed quest
      querySnapshot.forEach((doc) => {
        const questData = doc.data(); // Get the data of the quest document
        console.log(`- Quest Name: ${questData.questName}`);
        console.log(
          `  Current Progress: ${questData.currentProgress} / ${questData.maxProgress}`
        );
        console.log(`  Reward in Doubloons: ${questData.rewardInDoubloons}`);
        console.log("-------------------------");
      });
    }
  } catch (error) {
    console.error("Error fetching completed quests:", error);
  }
}

export async function getSpecificUsersQuestData(uid) {
  try {
    const collectionRef = collection(db, "User", uid, "usersQuest");
    const collectionSnapshot = await getDocs(collectionRef);

    const quests = collectionSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return quests;
  } catch (error) {
    console.log("Error: ", error);
    return [];
  }
}

export async function incrementQuestProgressForSpecificUser(uid, questName) {
  try {
    // get the specific quest for this particular uid first
    const questSnapshot = await getSpecificUsersQuestData(uid);
    // console.log(questSnapshot)
    questSnapshot.forEach((quest) => {
      if (quest.data().questName == questName) {
        // increment current progress by 1
        if (quest.data().currentProgress < quest.data().maxProgress) {
          const docRef = quest.ref;
          updateDoc(docRef, {
            currentProgress: quest.data().currentProgress + 1,
          })
            .then(() => {
              console.log(`SUCCESS: Quest ${questName} progress updated by 1.`);

              if (
                quest.data().currentProgress + 1 >=
                quest.data().maxProgress
              ) {
                console.log("yeen we neda update quest as completed");
                markQuestCompleteAndUpdateUsersPoints(uid, questName);
              }
            })
            .catch((err) => {
              console.log(
                `ERROR: Quest ${questName}'s progress could not be incremented. Err: ${err}`
              );
            });
        }
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function markQuestCompleteAndUpdateUsersPoints(uid, questName) {
  try {
    const questSnapshot = await getSpecificUsersQuestData(uid);
    questSnapshot.forEach((quest) => {
      if (quest.data().questName == questName) {
        // increment current progress by 1
        const docRef = quest.ref;
        updateDoc(docRef, { completed: true })
          .then(() => {
            console.log(`SUCCESS: Quest ${questName} marked complete`);

            // now update users points w/ reward in doubloons
            const reward = quest.data().rewardInDoubloons;
            updateUsersDoubloons(uid, reward);

            // updateDoc(userSnapshotRef[0], { "doubloons": userSnapshotRef.doubloons + reward })
            //     .then(() => {
            //         console.log("SUCCESS IN INCREMENT DOUBLOONS AFTER QUEST WAS COMPLETED")
            //     }).catch(err => { console.error("COULD NOT GIVE OUT REWARD IN DOUBLOONS")})
          })
          .catch((err) => {
            console.error(
              `ERROR: Quest ${questName} could not be marked complete. Err: ${err}`
            );
          });
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export async function updateUsersDoubloons(uid, amountOfDoubloons) {
  const userRef = doc(db, "User", uid);
  const userSnap = await getDoc(userRef);

  await updateDoc(userRef, {
    doubloons: userSnap.data().doubloons + amountOfDoubloons,
  })
    .then(() => {
      console.log("SUCCESS IN INCREMENT DOUBLOONS AFTER QUEST WAS COMPLETED");
    })
    .catch((err) => {
      console.error("COULD NOT GIVE OUT REWARD IN DOUBLOONS");
    });
}

export async function getUserByEmail(email) {
  try {
    // Reference the "User" collection
    const usersRef = collection(db, "User");

    // Create a query that searches for documents where the "email" field equals the given email
    const q = query(usersRef, where("email", "==", email));

    // Execute the query and retrieve matching documents
    const querySnapshot = await getDocs(q);

    // If no document matches, return null
    if (querySnapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return null;
    }

    // Since we expect the email to be unique, return the first matching document's data
    const userDoc = querySnapshot.docs[0];
    console.log(`User found: ${userDoc.id}`);
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserByUsername(username) {
  try {
    // Reference the "User" collection
    const usersRef = collection(db, "User");

    // Create a query that searches for documents where the "username" field equals the given username
    const q = query(usersRef, where("username", "==", username));

    // Execute the query and retrieve matching documents
    const querySnapshot = await getDocs(q);

    // If no document matches, return null
    if (querySnapshot.empty) {
      console.log(`No user found with username: ${username}`);
      return null;
    }

    // Since we expect the username to be unique, return the first matching document's data
    const userDoc = querySnapshot.docs[0];
    console.log(`User found: ${userDoc.id}`);
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error getting user by username:", error);
    return null;
  }
}

export async function createUserIfNotExists(username) {
  try {
    const res = await getUserByUsername(username);

    let userId;

    if (!res) {
      // Generate a random UID if the user doesn't exist
      userId = uuid.v4();
    } else {
      userId = res.id;
    }

    const userDocRef = doc(db, "User", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document
      const userData = {
        currentStreak: 0,
        doubloons: 0,
        email: "",
        itemRecycleCount: 0,
        lastRecycledDate: serverTimestamp(),
        petPirate: [],
        questsCompleted: [],
        uid: userId,
        username: username,
      };

      await setDoc(userDocRef, userData);
      console.log(`User created with UID: ${userId}, Username: ${username}`);

      // Initialize the usersQuest subcollection
      const usersQuestRef = collection(userDocRef, "usersQuest");

      const questData = [
        {
          questName: "Recycle Glass",
          currentProgress: 0,
          maxProgress: 2,
          completed: false,
          rewardInDoubloons: 5,
        },
        {
          questName: "Recycle Plastic",
          currentProgress: 0,
          maxProgress: 4,
          completed: false,
          rewardInDoubloons: 15,
        },
        {
          questName: "Recycle Cardboard",
          currentProgress: 0,
          maxProgress: 6,
          completed: false,
          rewardInDoubloons: 30,
        },
        {
          questName: "Recycle Bottles",
          currentProgress: 0,
          maxProgress: 50,
          completed: false,
          rewardInDoubloons: 500,
        },
      ];

      for (const quest of questData) {
        const questDocRef = doc(usersQuestRef);
        await setDoc(questDocRef, quest);
        console.log(
          `Quest "${quest.questName}" initialized for user ${userId}`
        );
      }

      // Fetch and return the created user data
      return { ...userData, lastRecycledDate: new Date() };
    } else {
      // Fetch and return existing user data
      console.log(res.id);
      return getUserByUid(res.id);
    }
  } catch (error) {
    console.error("Error creating or retrieving user:", error);
    return null; // Ensure the function always returns something
  }
}
