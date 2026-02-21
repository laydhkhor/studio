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

export const featuredBlogs = [
  {
    id: 1,
    title: '5 Simple Tips for a Healthier Heart',
    excerpt: 'Learn how small changes in your daily routine can make a big impact on your cardiovascular health.',
    imageUrl: 'https://picsum.photos/seed/blog1/600/400',
    imageHint: 'healthy food',
    slug: '/blog/healthy-heart-tips',
  },
  {
    id: 2,
    title: 'The Importance of Regular Exercise',
    excerpt: 'Discover the wide-ranging benefits of staying active, from physical fitness to mental well-being.',
    imageUrl: 'https://picsum.photos/seed/blog2/600/400',
    imageHint: 'person jogging',
    slug: '/blog/importance-of-exercise',
  },
  {
    id: 3,
    title: 'Managing Stress in a Fast-Paced World',
    excerpt: 'Practical advice and techniques to help you effectively manage stress and improve your quality of life.',
    imageUrl: 'https://picsum.photos/seed/blog3/600/400',
    imageHint: 'person meditating',
    slug: '/blog/managing-stress',
  },
];

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
