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
        professors: [],
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
        professors: [],
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
        professors: [],
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
        professors: [],
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
        professors: [],
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
        professors: [],
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
