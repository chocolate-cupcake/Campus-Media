import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import StudentProfile from "./StudentProfile";
import api from "../services/api";

function ProfileRouter() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const userData = await api.getUserProfile(id);
        setStudent(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>User not found</div>;

  return <StudentProfile student={student} />;
}

export default ProfileRouter;