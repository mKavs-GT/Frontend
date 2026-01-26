
import { JournalPost, HighlightReview } from '../types';

export const mockJournalPosts: JournalPost[] = [
  {
    id: 1,
    title: "An Unforgettable Parisian Adventure",
    content: "The Eiffel Tower at night is something everyone should see. The city's charm is undeniable, from the quaint cafes to the magnificent Louvre. Every street corner felt like a piece of history. The food was divine, especially the croissants!",
    rating: 5,
    image: "https://girlsthatroam.com/wp-content/uploads/2018/07/EiffelTower-AdobeStock_119631121-HC.jpeg",
    author: "Alex Johnson",
    location: "Paris, France",
    date: "2 weeks ago"
  },
  {
    id: 2,
    title: "Sunrise over the Grand Canyon",
    content: "Waking up at 4 AM was completely worth it. Watching the sun paint the canyon walls with hues of orange, pink, and purple was a spiritual experience. The sheer scale of it is impossible to capture in photos.",
    rating: 5,
    image: "https://fatmanlittletrail.com/wp-content/uploads/2022/03/Sunrise-at-Grand-Canyon-orange-with-sundogs.jpeg",
    author: "Samantha Bee",
    location: "Grand Canyon, USA",
    date: "1 month ago"
  },
  {
    id: 3,
    title: "Lost in the Streets of Tokyo",
    content: "Tokyo is a city of contrasts. One moment you're in the bustling chaos of Shibuya Crossing, the next you're in a serene and peaceful shrine. The food, the culture, the people – everything was amazing.",
    rating: 4,
    image: "https://p1.hippopx.com/preview/635/329/196/tokyo-night-shinjuku-lighting-evening-building.jpg",
    author: "Mike Chen",
    location: "Tokyo, Japan",
    date: "3 months ago"
  }
];

export const mockReviews: HighlightReview[] = [
  {
    id: 1,
    author: "Elena Rodriguez",
    location: "Machu Picchu, Peru",
    review: "Absolutely breathtaking. The trek was challenging but the reward at the end was more than worth it. It felt like stepping into another world. A truly magical place that lives up to all the hype.",
    rating: 5,
  },
  {
    id: 2,
    author: "David Smith",
    location: "Rome, Italy",
    review: "Walking through the Colosseum is like traveling back in time. The history is so palpable. I could have spent days just exploring the ancient ruins. Highly recommend a guided tour to get the full story.",
    rating: 5,
  },
  {
    id: 3,
    author: "Aisha Khan",
    location: "Taj Mahal, India",
    review: "The Taj Mahal is even more beautiful in person. The intricate details and the story behind it are so moving. It's a testament to love that has to be seen to be believed.",
    rating: 5,
  }
];
