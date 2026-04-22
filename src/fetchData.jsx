import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export const loadExperienceData = async () => {
  const expQuery = query(
    collection(db, "experience"),
    where("type", "==", "experience"),
    orderBy("period", "desc")
  );

  const eduQuery = query(
    collection(db, "experience"),
    where("type", "==", "education"),
    orderBy("period", "desc")
  );

  const [expSnapshot, eduSnapshot] = await Promise.all([
    getDocs(expQuery),
    getDocs(eduQuery)
  ]);

  return {
    experiences: expSnapshot.docs.map(doc => doc.data()),
    education: eduSnapshot.docs.map(doc => doc.data())
  };
};

export const loadProjectData = async () => {
  const projectQuery = query(
    collection(db, "projects"),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(projectQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};