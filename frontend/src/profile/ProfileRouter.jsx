import { useParams } from "react-router-dom";
import StudentProfile from "./StudentProfile";
import { students as studentData } from "../mainPage/studentData";

function ProfileRouter() {
  const { id } = useParams();

  const selectedStudent = studentData.find(
    (s) => s.id.toString() === id.toString()
  );

  return <StudentProfile student={selectedStudent} />;
}

export default ProfileRouter;
