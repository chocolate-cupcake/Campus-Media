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

export const students = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "alice123", // 🔐 for testing only, never store plaintext passwords in production
    profileImage: aliceImg,
    posts: [
      {
        id: 101,
        image: csFFImg,
        caption: "Did you know this about C# ?",
        date: "2025-10-30"
      },
      {
        id: 102,
        image: friendPostImg,
        caption: "Finished my group project early and started chit chatting 😊",
        date: "2025-11-01"
      }
    ],
    stories: [
      { id: 201, image: story1, viewed: false },
      { id: 202, image: story2, viewed: true }
    ],
    friends: [2, 3, 5],
    suggestions: [4, 6]
  },

  {
    id: 2,
    name: "Brian Smith",
    email: "brian.smith@example.com",
    password: "brian123",
    profileImage: brianImg,
    posts: [
      {
        id: 103,
        image: codeImg,
        caption: "Late-night coding session 💻",
        date: "2025-10-29"
      }
    ],
    stories: [{ id: 203, image: story3, viewed: true }],
    friends: [1, 4],
    suggestions: [3, 5]
  },

  {
    id: 3,
    name: "Carla Nguyen",
    email: "carla.nguyen@example.com",
    password: "carla123",
    profileImage: carlaImg,
    posts: [
      {
        id: 104,
        image: voulenteerImg,
        caption: "Volunteering at the campus fair 🎪",
        date: "2025-10-28"
      },
      {
        id: 105,
        image: funfactImg,
        caption: "I didn't know this ! 😁",
        date: "2025-11-01"
      }
    ],
    stories: [],
    friends: [1, 5, 6],
    suggestions: [2, 4]
  },

  {
    id: 4,
    name: "Daniel Lee",
    email: "daniel.lee@example.com",
    password: "daniel123",
    profileImage: danielImg,
    posts: [
      {
        id: 106,
        image: basketImg,
        caption: "Basketball practice was 🔥 today",
        date: "2025-10-27"
      }
    ],
    stories: [{ id: 204, image: story4, viewed: false }],
    friends: [2, 5],
    suggestions: [1, 3, 6]
  },

  {
    id: 5,
    name: "Emily Carter",
    email: "emily.carter@example.com",
    password: "emily123",
    profileImage: emilyImg,
    posts: [
      {
        id: 107,
        image: happyWeekendImg,
        caption: "Have a nice weekend to all of you ! ❤️",
        date: "2025-10-31"
      },
      {
        id: 108,
        image: greatDayImg,
        caption: "Today was so much funnn !!!",
        date: "2025-11-02"
      }
    ],
    stories: [{ id: 205, image: story5, viewed: false }],
    friends: [1, 3, 4],
    suggestions: [6]
  },

  {
    id: 6,
    name: "Fiona Brown",
    email: "fiona.brown@example.com",
    password: "fiona123",
    profileImage: fionaImg,
    posts: [],
    stories: [],
    friends: [3, 5],
    suggestions: [1, 2]
  }
];
