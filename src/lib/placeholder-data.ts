export const doctorDetails = {
  name: 'Dr. Pritam Pattyanayek',
  education: 'MBBS, Kolkata R.G. Kar Medical College',
  experience: '15+ Years',
  patientsServed: '2500+',
  practiceLocation: 'West Bengal, India',
  targetSeoLocations: 'Mahishadal, Nandakumar, Purba Medinipur',
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/clinic', label: 'Clinic' },
  { href: '/contact', label: 'Contact' },
];

export const pricingOptions = [
  {
    type: 'Chat',
    platform: 'WhatsApp',
    price: '₹200',
    description: 'Get your queries resolved over a chat.',
    cta: 'Start Chat',
  },
  {
    type: 'Video',
    platform: 'Google Meet',
    price: '₹500',
    description: 'A complete consultation via video call.',
    cta: 'Book Video Call',
  },
  {
    type: 'Clinic Visit',
    platform: 'In-person',
    price: '₹300',
    description: 'Visit our clinic for a full check-up.',
    cta: 'Get Number',
  },
];

export const clinicInfo = {
  address: 'Basulia, Mahishadal, Purba Medinipur, West Bengal, 721628',
  phone: '+91 12345 67890',
  email: 'contact@docassist.com',
  timings: 'Mon - Sat: 9:00 AM - 8:00 PM',
};

export const clinicLocations = [
  {
    id: 1,
    name: 'Mahishadal Clinic',
    address: 'Basulia, Mahishadal, Purba Medinipur, West Bengal',
    pinCode: '721628',
    phone: '+91 12345 67890',
    email: 'contact@docassist.com',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM',
  },
  {
    id: 2,
    name: 'Nandakumar Clinic',
    address: 'Nandakumar, Purba Medinipur, West Bengal',
    pinCode: '721632',
    phone: '+91 98765 43210',
    email: 'contact.nk@docassist.com',
    timings: 'Mon, Wed, Fri: 10:00 AM - 6:00 PM',
  },
];


export const featuredBlogs = [
  {
    id: 1,
    title: '5 Simple Tips for a Healthier Heart',
    excerpt: 'Learn how small changes in your daily routine can make a big impact on your cardiovascular health.',
    content: `Cardiovascular health is crucial for a long and healthy life. Here are five simple yet effective tips to keep your heart in top shape.\nFirst, focus on a heart-healthy diet. This means eating plenty of fruits, vegetables, whole grains, and lean proteins while limiting processed foods, sugar, and unhealthy fats.\nSecond, make regular exercise a priority. Aim for at least 30 minutes of moderate-intensity activity most days of the week. Activities like brisk walking, swimming, or cycling are excellent choices.\nThird, manage your stress levels. Chronic stress can contribute to heart disease. Practice relaxation techniques like meditation, deep breathing, or yoga.\nFourth, get enough quality sleep. Most adults need 7-9 hours of sleep per night. Poor sleep can negatively affect your heart health.\nFinally, know your numbers. Regularly check your blood pressure, cholesterol, and blood sugar levels to stay on top of your health.`,
    imageUrl: 'https://picsum.photos/seed/blog1/600/400',
    imageHint: 'healthy food',
    slug: 'healthy-heart-tips',
    category: 'Cardiology',
    date: '2024-07-22T09:00:00Z',
  },
  {
    id: 2,
    title: 'The Importance of Regular Exercise',
    excerpt: 'Discover the wide-ranging benefits of staying active, from physical fitness to mental well-being.',
    content: `Regular exercise is one of the most powerful things you can do for your health. It helps control weight, reduces the risk of heart disease, and can even improve your mood and mental clarity.\nFor most healthy adults, the Department of Health and Human Services recommends at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous aerobic activity a week, or a combination of both. You can spread this out throughout the week.\nExamples of moderate aerobic activity include brisk walking, swimming, and mowing the lawn. Vigorous aerobic activity includes things like running and aerobic dancing. Strength training for all major muscle groups at least two times a week is also recommended.`,
    imageUrl: 'https://picsum.photos/seed/blog2/600/400',
    imageHint: 'person jogging',
    slug: 'importance-of-exercise',
    category: 'Lifestyle',
    date: '2024-07-20T09:00:00Z',
  },
  {
    id: 3,
    title: 'Managing Stress in a Fast-Paced World',
    excerpt: 'Practical advice and techniques to help you effectively manage stress and improve your quality of life.',
    content: `Stress is a normal part of life, but chronic stress can take a toll on your health. Learning to manage it is essential for well-being.\nIdentify your stress triggers. What situations or thoughts cause you to feel stressed? Once you know, you can work on strategies to avoid or cope with them.\nPhysical activity is a fantastic stress reliever. It can pump up your endorphins and improve your mood. Even a short walk can make a difference.\nHealthy lifestyle choices also play a key role. Eat a balanced diet, get enough sleep, and limit caffeine and alcohol.\nDon't hesitate to seek support. Talk to friends, family, or a mental health professional about what you're going through.`,
    imageUrl: 'https://picsum.photos/seed/blog3/600/400',
    imageHint: 'person meditating',
    slug: 'managing-stress',
    category: 'Mental Health',
    date: '2024-07-18T09:00:00Z',
  },
];

export const allBlogs = [
  ...featuredBlogs,
  {
    id: 4,
    title: 'Understanding Diabetes: Causes and Prevention',
    excerpt: 'A comprehensive guide to understanding diabetes, its common causes, and lifestyle changes you can make to prevent it.',
    content: `Diabetes is a chronic disease that affects how your body turns food into energy. There are three main types: Type 1, Type 2, and gestational diabetes.\nType 2 diabetes is the most common and is often preventable. Risk factors include being overweight, being physically inactive, and having a family history of the disease.\nPrevention involves making healthy lifestyle choices. Eating a balanced diet low in sugar and processed foods, maintaining a healthy weight, and getting regular physical activity can significantly reduce your risk.\nIf you have prediabetes, these lifestyle changes can help prevent or delay the onset of Type 2 diabetes.`,
    imageUrl: 'https://picsum.photos/seed/blog4/600/400',
    imageHint: 'medical chart',
    slug: 'understanding-diabetes',
    category: 'Health Education',
    date: '2024-07-15T09:00:00Z',
  },
  {
    id: 5,
    title: 'Seasonal Allergies: How to Find Relief',
    excerpt: 'Don\'t let seasonal allergies ruin your day. Learn about common triggers and effective strategies to manage your symptoms.',
    content: `Seasonal allergies, also known as hay fever, are allergy symptoms that happen during certain times of the year, usually when outdoor molds release their spores, and trees, grasses, and weeds release tiny pollen particles into the air to fertilize other plants.\nCommon symptoms include sneezing, a runny or stuffy nose, and itchy, watery eyes.\nTo find relief, try to limit your exposure to allergens. Stay indoors on dry, windy days. Keep windows closed and use air conditioning. Over-the-counter medications like antihistamines and decongestants can also help manage symptoms. For severe allergies, consult a doctor about prescription treatments or allergy shots.`,
    imageUrl: 'https://picsum.photos/seed/blog5/600/400',
    imageHint: 'flowers field',
    slug: 'seasonal-allergies',
    category: 'Wellness',
    date: '2024-07-10T09:00:00Z',
  },
    {
    id: 6,
    title: 'The Benefits of a Good Night\'s Sleep',
    excerpt: 'Quality sleep is crucial for your physical and mental health. Explore the science of sleep and get tips for a more restful night.',
    content: `Sleep is not just a period of rest; it's a critical function that allows your body and mind to recharge. Getting quality sleep on a regular basis can help protect your mental health, physical health, quality of life, and safety.\nDuring sleep, your brain works to form new pathways for learning and remembering information. It also helps pay down "sleep debt" accumulated during periods of wakefulness.\nTo improve your sleep, stick to a regular sleep schedule, create a relaxing bedtime routine, and make sure your bedroom is dark, quiet, and cool. Avoid large meals, caffeine, and alcohol before bedtime.`,
    imageUrl: 'https://picsum.photos/seed/blog6/600/400',
    imageHint: 'person sleeping',
    slug: 'benefits-of-sleep',
    category: 'Lifestyle',
    date: '2024-07-05T09:00:00Z',
  },
    {
    id: 7,
    title: 'Your Guide to a Balanced Diet',
    excerpt: 'Eating a balanced diet is fundamental to good health. This guide breaks down the essentials of nutrition to help you make healthier choices.',
    content: `A balanced diet gives your body the nutrients it needs to function correctly. To get the nutrition you need, most of your daily calories should come from fresh fruits, fresh vegetables, whole grains, legumes, nuts, and lean proteins.\nPay attention to portion sizes. Even healthy foods can lead to weight gain if you eat too much.\nTry to eat a variety of foods to get all the nutrients you need. No single food can provide all the nutrients your body needs.\nDrink plenty of water. It's essential for digestion, absorption of nutrients, and getting rid of waste products.`,
    imageUrl: 'https://picsum.photos/seed/blog7/600/400',
    imageHint: 'healthy vegetables',
    slug: 'balanced-diet-guide',
    category: 'Nutrition',
    date: '2024-06-28T09:00:00Z',
  }
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


export const testimonials = [
  {
    id: 1,
    name: 'Anjali Sharma',
    location: 'Mahishadal',
    rating: 5,
    date: '2024-07-20T10:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    avatarHint: 'person smiling',
    comment:
      'Dr. Pattyanayek is incredibly attentive and caring. He listened to all my concerns and provided a clear, effective treatment plan. Highly recommended!',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Nandakumar',
    rating: 5,
    date: '2024-07-18T14:30:00Z',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    avatarHint: 'person face',
    comment:
      'The online video consultation was seamless and very convenient. The doctor was thorough and I received my prescription digitally right away. Excellent service.',
  },
  {
    id: 3,
    name: 'Priya Das',
    location: 'Purba Medinipur',
    rating: 4,
    date: '2024-06-25T09:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    avatarHint: 'happy person',
    comment:
      'A very professional and knowledgeable doctor. The clinic is clean and modern. My go-to healthcare provider in the region.',
  },
  {
    id: 4,
    name: 'Amit Singh',
    location: 'Mahishadal',
    rating: 4,
    date: '2024-07-21T11:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    avatarHint: 'person thinking',
    comment: 'Good experience overall. The doctor was patient and explained everything clearly. The waiting time was a bit long though.'
  },
  {
    id: 5,
    name: 'Sunita Devi',
    location: 'Nandakumar',
    rating: 3,
    date: '2024-05-15T16:00:00Z',
    avatarUrl: 'https://picsum.photos/seed/user5/100/100',
    avatarHint: 'serious person',
    comment: 'The consultation was okay, but I felt it was a bit rushed. The prescription helped, but I expected a more detailed discussion.'
  }
];

export const faqs = [
  {
    question: 'How do I book an appointment?',
    answer:
      'You can book an appointment by clicking the "Book Now" button on our website. You can choose between a chat consultation, a video call, or a clinic visit. Follow the steps to select an available time slot and confirm your booking.',
  },
  {
    question: 'What are the charges for consultation?',
    answer:
      'Our pricing is transparent. A chat consultation is ₹200, a video call is ₹500, and a clinic visit is ₹300. You can find more details in our "Pricing" section.',
  },
  {
    question: 'How do I receive my prescription?',
    answer:
      'After your consultation, the doctor will generate a digital prescription which will be available in your secure patient account on our website. You will receive a notification once it is ready.',
  },
  {
    question: 'What are the clinic timings?',
    answer:
      'Our clinic is open from Monday to Saturday, 9:00 AM to 8:00 PM. We are closed on Sundays. You can find our full address and a map on the "Clinic" page.',
  },
];

export const adminNavItems = [
  {
    href: '/admin/dashboard',
    icon: 'LayoutDashboard',
    label: 'Dashboard',
  },
  {
    href: '/admin/patients',
    icon: 'Users',
    label: 'Patients',
  },
  {
    href: '/admin/bookings',
    icon: 'Calendar',
    label: 'Bookings',
  },
  {
    href: '/admin/prescriptions',
    icon: 'ClipboardPlus',
    label: 'Prescriptions',
  },
  {
    href: '/admin/seo-tool',
    icon: 'Sparkles',
    label: 'SEO Tool',
  },
];

export const adminSettingsNav = [
    {
    href: '/admin/settings',
    icon: 'Settings',
    label: 'Settings',
  }
];
