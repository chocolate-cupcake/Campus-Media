import fionaImg from "../assets/profiles/fiona.jpg";
import aliceImg from "../assets/profiles/aliceImg.jpg";
import brianImg from "../assets/profiles/brianImg.jpg";
import carlaImg from "../assets/profiles/carlaImg.jpg";
import danielImg from "../assets/profiles/danielImg.jpg";
import emilyImg from "../assets/profiles/emilyImg.jpg";

import basketImg from "../assets/posts/basket.jpg";
import codeImg from "../assets/posts/code.jpg";
import csFFImg from "../assets/posts/CsharpFunFact.png";
import friendPostImg from "../assets/posts/friendPost.jpg";
import funfactImg from "../assets/posts/fun_fact.jpg";
import greatDayImg from "../assets/posts/greatDay.jpg";
import happyWeekendImg from "../assets/posts/happyWeekend.jpg";
import voulenteerImg from "../assets/posts/happyWeekend.jpg";

import story1 from "../assets/stories/storie1.jpg";
import story2 from "../assets/stories/story2.jpg";
import story3 from "../assets/stories/story3.jpg";
import story4 from "../assets/stories/story4.jpg";
import story5 from "../assets/stories/story5.jpg";

const STORAGE_KEY = "campus_media_students_v1";

const defaultStudents = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@unitir.edu.al",
    password: "alice123",
    university: "Universiteti i Tiranës",
    department: "Departamenti i Informatikës",
    profileImage: aliceImg,
    posts: [
      {
        id: 101,
        image: csFFImg,
        caption: "A e dinit këtë për C# ?",
        date: "2025-10-30",
      },
      {
        id: 102,
        image: friendPostImg,
        caption: "E mbaruam projektin në grup më herët dhe po qeshim pak 😊",
        date: "2025-11-01",
      },
    ],
    stories: [
      { id: 201, image: story1, viewed: false },
      { id: 202, image: story2, viewed: true },
    ],
    friends: [2, 3, 5],
    suggestions: [4, 6],
  },
  {
    id: 2,
    name: "Brian Smith",
    email: "brian.smith@polis.edu.al",
    password: "brian123",
    university: "Universiteti POLIS",
    department: "Inxhinieri Softuerike",
    profileImage: brianImg,
    posts: [
      {
        id: 103,
        image: codeImg,
        caption: "Sesioni i kodimit natën vonë 💻",
        date: "2025-10-29",
      },
    ],
    stories: [{ id: 203, image: story3, viewed: true }],
    friends: [1, 4],
    suggestions: [3, 5],
  },
  {
    id: 3,
    name: "Carla Nguyen",
    email: "carla.nguyen@ubt.edu.al",
    password: "carla123",
    university: "Universiteti për Biznes dhe Teknologji (UBT)",
    department: "Shkenca Mjedisore",
    profileImage: carlaImg,
    posts: [
      {
        id: 104,
        image: voulenteerImg,
        caption: "Vullnetare në panairin e kampusit 🎪",
        date: "2025-10-28",
      },
      {
        id: 105,
        image: funfactImg,
        caption: "Nuk e dija këtë! 😁",
        date: "2025-11-01",
      },
    ],
    stories: [],
    friends: [1, 5, 6],
    suggestions: [2, 4],
  },
  {
    id: 4,
    name: "Daniel Lee",
    email: "daniel.lee@uts.edu.al",
    password: "daniel123",
    university: "Universiteti Teknik i Shqipërisë",
    department: "Shkencat e Sportit",
    profileImage: danielImg,
    posts: [
      {
        id: 106,
        image: basketImg,
        caption: "Stërvitja e basketbollit sot ishte 🔥",
        date: "2025-10-27",
      },
    ],
    stories: [{ id: 204, image: story4, viewed: false }],
    friends: [2, 5],
    suggestions: [1, 3, 6],
  },
  {
    id: 5,
    name: "Emily Carter",
    email: "emily.carter@uet.edu.al",
    password: "emily123",
    university: "Universiteti Europian i Tiranës (UET)",
    department: "Teknologjia e Informacionit",
    profileImage: emilyImg,
    posts: [
      {
        id: 107,
        image: happyWeekendImg,
        caption: "Ju uroj fundjavë të mbarë të gjithëve! ❤️",
        date: "2025-10-31",
      },
      {
        id: 108,
        image: greatDayImg,
        caption: "Sot ishte ditë fantastike!!!",
        date: "2025-11-02",
      },
    ],
    stories: [{ id: 205, image: story5, viewed: false }],
    friends: [1, 3, 4],
    suggestions: [6],
  },
  {
    id: 6,
    name: "Fiona Brown",
    email: "fiona.brown@albanianuniversity.edu.al",
    password: "fiona123",
    university: "Albanian University",
    department: "Dizajn Grafik dhe Media Dixhitale",
    profileImage: fionaImg,
    posts: [],
    stories: [],
    friends: [3, 5],
    suggestions: [1, 2],
  },
];

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read students from localStorage", e);
    return null;
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write students to localStorage", e);
  }
}

export function initializeStudents() {
  const existing = readStorage();
  if (!existing) {
    writeStorage(defaultStudents);
    return defaultStudents;
  }
  return existing;
}

export function getStudents() {
  return readStorage() || initializeStudents();
}

export function findStudentById(id) {
  const list = getStudents();
  return list.find((s) => s.id === Number(id));
}

export function addStudent(student) {
  const list = getStudents();
  const nextId = list.reduce((max, s) => Math.max(max, s.id), 0) + 1;
  const newStudent = { id: nextId, ...student };
  list.push(newStudent);
  writeStorage(list);
  return newStudent;
}

export function updateStudent(id, patch) {
  const list = getStudents();
  const idx = list.findIndex((s) => s.id === Number(id));
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  writeStorage(list);
  return list[idx];
}

export function replaceStudents(newList) {
  writeStorage(newList);
}

// Ensure it's initialized on module load
initializeStudents();

export default {
  getStudents,
  findStudentById,
  addStudent,
  updateStudent,
  replaceStudents,
};

export const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@unitir.edu.al",
    password: "alice123",
    university: "Universiteti i Tiranës",
    department: "Departamenti i Informatikës",
    profileImage: aliceImg,
    posts: [
      {
        id: 101,
        image: csFFImg,
        caption: "A e dinit këtë për C# ?",
        date: "2025-10-30",
      },
      {
        id: 102,
        image: friendPostImg,
        caption: "E mbaruam projektin në grup më herët dhe po qeshim pak 😊",
        date: "2025-11-01",
      },
    ],
    stories: [
      { id: 201, image: story1, viewed: false },
      { id: 202, image: story2, viewed: true },
    ],
    friends: [2, 3, 5],
    suggestions: [4, 6],
  },

  {
    id: 2,
    name: "Brian Smith",
    email: "brian.smith@polis.edu.al",
    password: "brian123",
    university: "Universiteti POLIS",
    department: "Inxhinieri Softuerike",
    profileImage: brianImg,
    posts: [
      {
        id: 103,
        image: codeImg,
        caption: "Sesioni i kodimit natën vonë 💻",
        date: "2025-10-29",
      },
    ],
    stories: [{ id: 203, image: story3, viewed: true }],
    friends: [1, 4],
    suggestions: [3, 5],
  },

  {
    id: 3,
    name: "Carla Nguyen",
    email: "carla.nguyen@ubt.edu.al",
    password: "carla123",
    university: "Universiteti për Biznes dhe Teknologji (UBT)",
    department: "Shkenca Mjedisore",
    profileImage: carlaImg,
    posts: [
      {
        id: 104,
        image: voulenteerImg,
        caption: "Vullnetare në panairin e kampusit 🎪",
        date: "2025-10-28",
      },
      {
        id: 105,
        image: funfactImg,
        caption: "Nuk e dija këtë! 😁",
        date: "2025-11-01",
      },
    ],
    stories: [],
    friends: [1, 5, 6],
    suggestions: [2, 4],
  },

  {
    id: 4,
    name: "Daniel Lee",
    email: "daniel.lee@uts.edu.al",
    password: "daniel123",
    university: "Universiteti Teknik i Shqipërisë",
    department: "Shkencat e Sportit",
    profileImage: danielImg,
    posts: [
      {
        id: 106,
        image: basketImg,
        caption: "Stërvitja e basketbollit sot ishte 🔥",
        date: "2025-10-27",
      },
    ],
    stories: [{ id: 204, image: story4, viewed: false }],
    friends: [2, 5],
    suggestions: [1, 3, 6],
  },

  {
    id: 5,
    name: "Emily Carter",
    email: "emily.carter@uet.edu.al",
    password: "emily123",
    university: "Universiteti Europian i Tiranës (UET)",
    department: "Teknologjia e Informacionit",
    profileImage: emilyImg,
    posts: [
      {
        id: 107,
        image: happyWeekendImg,
        caption: "Ju uroj fundjavë të mbarë të gjithëve! ❤️",
        date: "2025-10-31",
      },
      {
        id: 108,
        image: greatDayImg,
        caption: "Sot ishte ditë fantastike!!!",
        date: "2025-11-02",
      },
    ],
    stories: [{ id: 205, image: story5, viewed: false }],
    friends: [1, 3, 4],
    suggestions: [6],
  },

  {
    id: 6,
    name: "Fiona Brown",
    email: "fiona.brown@albanianuniversity.edu.al",
    password: "fiona123",
    university: "Albanian University",
    department: "Dizajn Grafik dhe Media Dixhitale",
    profileImage: fionaImg,
    posts: [],
    stories: [],
    friends: [3, 5],
    suggestions: [1, 2],
  },
];
