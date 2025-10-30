
 const universities = [
  {
    id: 1,
    name: "University of Tirana",
    location: "Tirana, Albania",
    foundedYear: 1957,
    type: "Public",
    rating: 4.5,
    studentCount: 28000,
    departments: [
      {
        id: 101,
        name: "Department of Computer Science",
        faculty: "Faculty of Natural Sciences",
        rating: 4.6,
        averageCredits: 180,
        professors: [
          {
            id: 1,
            name: "Dr. Arben Kola",
            age: 45,
            degree: "PhD in Artificial Intelligence",
            graduatedFrom: "Politecnico di Milano",
            rating: 4.8,
            email: "arben.kola@unitir.edu.al",
            yearsOfExperience: 20
          },
          {
            id: 2,
            name: "Prof. Elira Hoxha",
            age: 39,
            degree: "MSc in Computer Engineering",
            graduatedFrom: "University of Tirana",
            rating: 4.3,
            email: "elira.hoxha@unitir.edu.al",
            yearsOfExperience: 14
          }
        ]
      },
      {
        id: 102,
        name: "Department of Mathematics",
        faculty: "Faculty of Natural Sciences",
        rating: 4.4,
        averageCredits: 180,
        professors: [
          {
            id: 3,
            name: "Dr. Luan Gjoni",
            age: 50,
            degree: "PhD in Applied Mathematics",
            graduatedFrom: "ETH Zurich",
            rating: 4.7,
            email: "luan.gjoni@unitir.edu.al",
            yearsOfExperience: 25
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
    type: "Public",
    rating: 4.7,
    studentCount: 18000,
    departments: [
      {
        id: 201,
        name: "Department of Electronic Engineering",
        faculty: "Faculty of Electrical Engineering",
        rating: 4.8,
        professors: [
          {
            id: 4,
            name: "Prof. Dr. Ilir Meta",
            age: 55,
            degree: "PhD in Electronic Engineering",
            graduatedFrom: "TU München",
            rating: 4.9,
            yearsOfExperience: 30,
            email: "ilir.meta@upt.edu.al"
          },
          {
            id: 5,
            name: "Dr. Klea Rina",
            age: 34,
            degree: "PhD in Embedded Systems",
            graduatedFrom: "University of Bologna",
            rating: 4.6,
            yearsOfExperience: 10,
            email: "klea.rina@upt.edu.al"
          }
        ]
      },
      {
        id: 202,
        name: "Department of Computer Engineering",
        faculty: "Faculty of Information Technology",
        rating: 4.5,
        professors: [
          {
            id: 6,
            name: "Dr. Dritan Leka",
            age: 41,
            degree: "PhD in Machine Learning",
            graduatedFrom: "Imperial College London",
            rating: 4.7,
            yearsOfExperience: 17,
            email: "dritan.leka@upt.edu.al"
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
    type: "Private",
    rating: 4.8,
    studentCount: 5000,
    departments: [
      {
        id: 301,
        name: "Department of Computer Engineering",
        faculty: "Faculty of Architecture and Engineering",
        rating: 4.9,
        teachingLanguage: "English",
        professors: [
          {
            id: 7,
            name: "Dr. Enis Dervishi",
            age: 38,
            degree: "PhD in Artificial Intelligence",
            graduatedFrom: "Middle East Technical University",
            rating: 4.8,
            yearsOfExperience: 13,
            email: "e.dervishi@epoka.edu.al"
          },
          {
            id: 8,
            name: "Prof. Jonida Cela",
            age: 44,
            degree: "PhD in Data Science",
            graduatedFrom: "University of Milan",
            rating: 4.6,
            yearsOfExperience: 19,
            email: "j.cela@epoka.edu.al"
          }
        ]
      },
      {
        id: 302,
        name: "Department of Architecture",
        faculty: "Faculty of Architecture and Engineering",
        rating: 4.8,
        teachingLanguage: "English",
        professors: []
      },
      {
        id: 303,
        name: "Department of Civil Engineering",
        faculty: "Faculty of Architecture and Engineering",
        rating: 4.8,
        teachingLanguage: "English",
        professors: []
      },
      {
        id: 304,
        name: "Department of Business Administration",
        faculty: "Faculty of Economics and Administrative Sciences",
        rating: 4.7,
        teachingLanguage: "English",
        professors: []
      },
      {
        id: 305,
        name: "Department of Banking and Finance",
        faculty: "Faculty of Economics and Administrative Sciences",
        rating: 4.7,
        teachingLanguage: "English",
        professors: [
          {
            id: 9,
            name: "Dr. Arta Duka",
            age: 40,
            degree: "PhD in Finance",
            graduatedFrom: "Ankara University",
            rating: 4.5,
            yearsOfExperience: 15,
            email: "a.duka@epoka.edu.al"
          }
        ]
      },
      {
        id: 306,
        name: "Department of Economics",
        faculty: "Faculty of Economics and Administrative Sciences",
        rating: 4.6,
        teachingLanguage: "English",
        professors: []
      },
      {
        id: 307,
        name: "Department of Law",
        faculty: "Faculty of Law and Social Sciences",
        rating: 4.5,
        teachingLanguage: "English/Albanian",
        professors: []
      },
      {
        id: 308,
        name: "Department of Political Science and International Relations",
        faculty: "Faculty of Law and Social Sciences",
        rating: 4.6,
        teachingLanguage: "English",
        professors: []
      },
      {
        id: 309,
        name: "Center for European Studies",
        faculty: "Faculty of Law and Social Sciences",
        rating: 4.4,
        teachingLanguage: "English",
        professors: []
      }
    ]
  }
];

export default universities;
