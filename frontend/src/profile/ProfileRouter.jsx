import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentProfile from "./StudentProfile.jsx";
import ProfessorProfile from "./ProfessorProfile.jsx";
import { findStudentById } from "../mainPage/studentData.js";
import universities from "../Dashboard/data.js";

function findProfessorById(id) {
  const strId = String(id);
  for (const uni of universities) {
    for (const dept of uni.departments || []) {
      for (const prof of dept.professors || []) {
        if (String(prof.id) === strId) {
          return {
            id: prof.id,
            name: `${prof.name} ${prof.surname || ""}`.trim(),
            department: dept.name,
            profileImage: "",
            isProfessor: true,
          };
        }
      }
    }
  }
  return null;
}

export default function ProfileRouter() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate("/main-page");
    return null;
  }

  const student = findStudentById(id);
  if (student) return <StudentProfile />;

  const professor = findProfessorById(id);
  if (professor) return <ProfessorProfile />;

  navigate("/main-page");
  return null;
}
