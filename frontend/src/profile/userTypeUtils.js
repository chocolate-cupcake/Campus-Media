import universities from "../Dashboard/data.js";

// Check if a user is a professor
export function isProfessor(userId) {
  const strId = String(userId);
  for (const uni of universities) {
    for (const dept of uni.departments || []) {
      for (const prof of dept.professors || []) {
        if (String(prof.id) === strId) {
          return true;
        }
      }
    }
  }
  return false;
}

// ✔ Find student by ID
export function findStudentById(id) {
  const strId = String(id);
  for (const uni of universities) {
    for (const dept of uni.departments || []) {
      for (const student of dept.students || []) {
        if (String(student.id) === strId) {
          return student;
        }
      }
    }
  }
  return null;
}

// ✔ Find professor by ID
export function findProfessorById(id) {
  const strId = String(id);
  for (const uni of universities) {
    for (const dept of uni.departments || []) {
      for (const prof of dept.professors || []) {
        if (String(prof.id) === strId) {
          return prof;
        }
      }
    }
  }
  return null;
}

// ✔ Determine user type based on stored user object
export function getUserType() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    const user = JSON.parse(stored);
    return user.user_type || null;
  } catch (err) {
    return null;
  }
}
