const universities = [
  {
    id: 1,
    name: "University of Tirana",
    aliases: ["Universiteti i Tiranës", "unitir", "universityoftirana"],
    location: "Tirana, Albania",
    foundedYear: 1957,
    type: ["Public", "Science", "Technology", "All"],
    rating: 4.5, // University average
    studentCount: 28000,
    departments: [
      {
        id: 101,
        name: "Department of Computer Science",
        faculty: "Faculty of Natural Sciences",
        description:
          "Offers programs in computer science, software engineering, and information technology.",
        rating: 4.6, // Department average
        type: ["IT", "Engineering", "AI", "Technology", "All"],
        professors: [
          {
            id: 1001,
            name: "Arben",
            surname: "Kola",
            title: "Associate Professor",
            email: "arben.kola@unitir.edu.al",
            phone: "+355 4 222 000",
            office: "Building B, Room 214",
            courses: ["Algorithms", "Data Structures", "Intro to AI"],
            rating: 4.8,
            yearsOfExperience: 18,
            researchAreas: ["Artificial Intelligence", "Machine Learning"]
          },
          {
            id: 1002,
            name: "Elira",
            surname: "Hoxha",
            title: "Assistant Professor",
            email: "elira.hoxha@unitir.edu.al",
            phone: "+355 4 222 001",
            office: "Building B, Room 220",
            courses: ["Software Engineering", "Databases"],
            rating: 4.3,
            yearsOfExperience: 12,
            researchAreas: ["Software Engineering", "Databases"]
          }
        ],
        programs: [
          {
            id: 1,
            name: "Bachelor in Computer Science",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 4.6,
            type: ["IT", "Programming", "AI", "Engineering", "All"]
          },
          {
            id: 2,
            name: "Master in Software Engineering",
            degree: "MSc",
            credits: 120,
            language: "Albanian",
            rating: 4.7,
            type: ["Engineering", "AI", "IT", "Software", "All"]
          }
        ]
      },
      {
        id: 102,
        name: "Department of Mathematics",
        faculty: "Faculty of Natural Sciences",
        description:
          "Rigorous programs in mathematics and applied data science.",
        rating: 4.5,
        type: ["Mathematics", "Data Science", "Research", "All"],
        professors: [
          {
            id: 1003,
            name: "Luan",
            surname: "Gjoni",
            title: "Professor",
            email: "luan.gjoni@unitir.edu.al",
            phone: "+355 4 222 002",
            office: "Math Building, Room 101",
            courses: ["Calculus", "Applied Mathematics"],
            rating: 4.7,
            yearsOfExperience: 25,
            researchAreas: ["Numerical Analysis", "Data Science"]
          }
        ],
        programs: [
          {
            id: 3,
            name: "Bachelor in Applied Mathematics",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 4.5,
            type: ["Mathematics", "Data Science", "Research", "All"]
          },
          {
            id: 4,
            name: "Master in Data Analytics",
            degree: "MSc",
            credits: 120,
            language: "Albanian",
            rating: 4.8,
            type: ["AI", "Data Science", "IT", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Polytechnic University of Tirana",
    aliases: [ "polytechnicuniversityoftirana"],
    location: "Tirana, Albania",
    foundedYear: 1951,
    type: ["Public", "Engineering", "Technology", "All"],
    rating: 4.7,
    studentCount: 18000,
    departments: [
      {
        id: 201,
        name: "Department of Electronic Engineering",
        faculty: "Faculty of Electrical Engineering",
        rating: 4.8,
        type: ["Engineering", "Electronics", "Hardware", "Telecom", "All"],
        professors: [
          {
            id: 1004,
            name: "Ilir",
            surname: "Meta",
            title: "Professor",
            email: "ilir.meta@upt.edu.al",
            phone: "+355 4 333 100",
            office: "Engineering Block, Room 9",
            courses: ["Electronic Circuits", "Signal Processing"],
            rating: 4.9,
            yearsOfExperience: 30,
            researchAreas: ["Electronics", "Embedded Systems"]
          },
          {
            id: 1005,
            name: "Klea",
            surname: "Rina",
            title: "Senior Lecturer",
            email: "klea.rina@upt.edu.al",
            phone: "+355 4 333 101",
            office: "Engineering Block, Room 11",
            courses: ["Embedded Systems", "Hardware Design"],
            rating: 4.6,
            yearsOfExperience: 10,
            researchAreas: ["Embedded Systems", "IoT"]
          }
        ],
        programs: [
          {
            id: 5,
            name: "Bachelor in Electronic Engineering",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 4.7,
            type: ["Engineering", "Electronics", "Hardware", "All"]
          },
          {
            id: 6,
            name: "Master in Telecommunications",
            degree: "MSc",
            credits: 120,
            language: "Albanian",
            rating: 4.8,
            type: ["Engineering", "Networking", "IT", "Telecom", "All"]
          }
        ]
      },
      {
        id: 202,
        name: "Department of Computer Engineering",
        faculty: "Faculty of Information Technology",
        rating: 4.5,
        type: ["IT", "Engineering", "AI", "All"],
        professors: [
          {
            id: 1006,
            name: "Dritan",
            surname: "Leka",
            title: "Associate Professor",
            email: "dritan.leka@upt.edu.al",
            phone: "+355 4 333 200",
            office: "IT Building, Room 5",
            courses: ["Machine Learning", "Data Mining"],
            rating: 4.7,
            yearsOfExperience: 17,
            researchAreas: ["Machine Learning", "Computer Vision"]
          }
        ],
        programs: [
          {
            id: 7,
            name: "Bachelor in Computer Engineering",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 4.6,
            type: ["IT", "Engineering", "AI", "All"]
          },
          {
            id: 8,
            name: "Master in Embedded Systems",
            degree: "MSc",
            credits: 120,
            language: "English",
            rating: 4.7,
            type: ["Engineering", "Hardware", "AI", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Epoka University",
    aliases: ["Epoka University", "epoka"],
    location: "Tirana, Albania",
    foundedYear: 2007,
    type: ["Private", "International", "Multidisciplinary", "All"],
    rating: 4.93,
    studentCount: 5000,
    departments: [
      {
        id: 301,
        name: "Department of Computer Engineering",
        faculty: "Faculty of Architecture and Engineering",
        rating: 4.9,
        type: ["AI", "IT", "Engineering", "All"],
        professors: [
          {
            id: 1007,
            name: "Enis",
            surname: "Dervishi",
            title: "Assistant Professor",
            email: "e.dervishi@epoka.edu.al",
            phone: "+355 4 444 010",
            office: "Epoka Main, Room 12",
            courses: ["Artificial Intelligence", "Deep Learning"],
            rating: 4.8,
            yearsOfExperience: 13,
            researchAreas: ["AI", "Deep Learning"]
          },
          {
            id: 1008,
            name: "Ervis ",
            surname: "Trupja",
            title: "Professor",
            email: "e.trupja@epoka.edu.al",
            phone: "+355 4 444 011",
            office: "Epoka Main, Room 14",
            courses: ["Web Development"],
            rating: 5.0,
            yearsOfExperience: 19,
            researchAreas: ["Data Science", "Statistics"]
          }
        ],
        programs: [
          {
            id: 9,
            name: "Bachelor in Computer Engineering",
            degree: "BSc",
            credits: 180,
            language: "English",
            rating: 4.9,
            type: ["AI", "IT", "Engineering", "All"]
          },
          {
            id: 10,
            name: "Master in Artificial Intelligence",
            degree: "MSc",
            credits: 120,
            language: "English",
            rating: 4.9,
            type: ["AI", "Data Science", "Machine Learning", "All"]
          }
        ]
      },
      {
        id: 304,
        name: "Department of Business Administration",
        faculty: "Faculty of Economics and Administrative Sciences",
        rating: 4.7,
        type: ["Business", "Management", "Social", "All"],
        professors: [
          {
            id: 1009,
            name: "Arta",
            surname: "Duka",
            title: "Senior Lecturer",
            email: "a.duka@epoka.edu.al",
            phone: "+355 4 444 020",
            office: "Epoka Economics, Room 3",
            courses: ["Corporate Finance", "Banking"],
            rating: 4.5,
            yearsOfExperience: 15,
            researchAreas: ["Finance", "Economics"]
          }
        ],
        programs: [
          {
            id: 11,
            name: "Bachelor in Business Administration",
            degree: "BSc",
            credits: 180,
            language: "English",
            rating: 4.7,
            type: ["Business", "Management", "Social", "All"]
          },
          {
            id: 12,
            name: "Master in Marketing Management",
            degree: "MSc",
            credits: 120,
            language: "English",
            rating: 4.8,
            type: ["Business", "Social", "Marketing", "All"]
          }
        ]
      }
    ]
  }
];

export default universities;

// Additional universities mirrored from studentData defaults
universities.push(
  {
    id: 4,
    name: "Universiteti POLIS",
    aliases: [ "POLIS", "polis"],
    location: "Tirana, Albania",
    foundedYear: 2006,
    type: ["Private", "Architecture", "All"],
    rating: 4.2,
    studentCount: 3000,
    departments: [
      {
        id: 401,
        name: "Department of Architecture",
        faculty: "Faculty of Architecture",
        description: "Design-focused architecture and urbanism programs.",
        rating: 4.3,
        type: ["Architecture", "Design", "All"],
        professors: [
          {
            id: 4001,
            name: "Arlind",
            surname: "Hysaj",
            title: "Lecturer",
            email: "a.hysaj@polis.edu.al",
            courses: ["Architectural Design", "Urban Studies"],
            rating: 4.1,
            yearsOfExperience: 8,
            researchAreas: ["Urbanism", "Sustainable Design"]
          }
        ],
        programs: [
          {
            id: 4011,
            name: "Bachelor in Architecture",
            degree: "BArch",
            credits: 180,
            language: "English",
            rating: 4.2,
            type: ["Architecture", "Design", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Universiteti për Biznes dhe Teknologji (UBT)",
    aliases: ["UBT", "Universiteti per Biznes dhe Teknologji", "Universiteti për Biznes dhe Teknologji"],
    location: "Prishtina, Kosovo",
    foundedYear: 2001,
    type: ["Private", "Business", "Technology", "All"],
    rating: 4.4,
    studentCount: 8000,
    departments: [
      {
        id: 501,
        name: "Department of Business",
        faculty: "Faculty of Business",
        description: "Business and management programs with international orientation.",
        rating: 4.5,
        type: ["Business", "Management", "All"],
        professors: [
          {
            id: 5001,
            name: "Gent",
            surname: "Krasniqi",
            title: "Associate Professor",
            email: "g.krasniqi@ubt.edu.al",
            courses: ["Economics", "Corporate Finance"],
            rating: 4.6,
            yearsOfExperience: 12,
            researchAreas: ["Finance", "Economics"]
          }
        ],
        programs: [
          {
            id: 5011,
            name: "Bachelor in Business Administration",
            degree: "BBA",
            credits: 180,
            language: "English",
            rating: 4.4,
            type: ["Business", "Management", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Universiteti Teknik i Shqipërisë",
    aliases: ["Technical University of Albania", "Universiteti Teknik"],
    location: "Tirana, Albania",
    foundedYear: 1950,
    type: ["Public", "Engineering", "All"],
    rating: 4.3,
    studentCount: 15000,
    departments: [
      {
        id: 601,
        name: "Department of Engineering",
        faculty: "Faculty of Engineering",
        description: "Engineering programs across multiple disciplines.",
        rating: 4.2,
        type: ["Engineering", "Technology", "All"],
        professors: [
          {
            id: 6001,
            name: "Blerim",
            surname: "Meta",
            title: "Professor",
            email: "b.meta@uts.edu.al",
            courses: ["Mechanics", "Thermodynamics"],
            rating: 4.3,
            yearsOfExperience: 20,
            researchAreas: ["Mechanical Engineering"]
          }
        ],
        programs: [
          {
            id: 6011,
            name: "Bachelor in Mechanical Engineering",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 4.1,
            type: ["Engineering", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Universiteti Europian i Tiranës (UET)",
    aliases: ["UET", "Universiteti Europian"],
    location: "Tirana, Albania",
    foundedYear: 2006,
    type: ["Private", "International", "All"],
    rating: 4.0,
    studentCount: 7000,
    departments: [
      {
        id: 701,
        name: "Department of IT",
        faculty: "Faculty of Information Technology",
        description: "IT and applied computing programs.",
        rating: 4.1,
        type: ["IT", "Engineering", "All"],
        professors: [
          {
            id: 7001,
            name: "Elton",
            surname: "Hysi",
            title: "Senior Lecturer",
            email: "e.hysi@uet.edu.al",
            courses: ["Web Development", "Databases"],
            rating: 4.0,
            yearsOfExperience: 9,
            researchAreas: ["Web", "Databases"]
          }
        ],
        programs: [
          {
            id: 7011,
            name: "Bachelor in Information Technology",
            degree: "BSc",
            credits: 180,
            language: "English",
            rating: 4.0,
            type: ["IT", "All"]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Albanian University",
    aliases: ["Albanian University", "AlbanianUniv"],
    location: "Tirana, Albania",
    foundedYear: 2009,
    type: ["Private", "Multidisciplinary", "All"],
    rating: 3.9,
    studentCount: 6000,
    departments: [
      {
        id: 801,
        name: "Department of Media and Design",
        faculty: "Faculty of Arts",
        description: "Design and media programs focused on practical skills.",
        rating: 3.8,
        type: ["Design", "Media", "All"],
        professors: [
          {
            id: 8001,
            name: "Fjolla",
            surname: "Basha",
            title: "Lecturer",
            email: "f.basha@albanianuniversity.edu.al",
            courses: ["Graphic Design", "Digital Media"],
            rating: 3.9,
            yearsOfExperience: 6,
            researchAreas: ["Design", "Media"]
          }
        ],
        programs: [
          {
            id: 8011,
            name: "Bachelor in Graphic Design",
            degree: "BSc",
            credits: 180,
            language: "Albanian",
            rating: 3.9,
            type: ["Design", "All"]
          }
        ]
      }
    ]
  }
);
