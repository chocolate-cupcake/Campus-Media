import universities from "../Dashboard/data.js";

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
