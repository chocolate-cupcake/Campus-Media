const universities = [
  {
    id: 1,
    name: "University of Tirana",
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
    location: "Tirana, Albania",
    foundedYear: 2007,
    type: ["Private", "International", "Multidisciplinary", "All"],
    rating: 4.8,
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
            name: "Jonida",
            surname: "Cela",
            title: "Professor",
            email: "j.cela@epoka.edu.al",
            phone: "+355 4 444 011",
            office: "Epoka Main, Room 14",
            courses: ["Data Science", "Statistics"],
            rating: 4.6,
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
