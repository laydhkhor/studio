
import images from './placeholder-images.json';

export const homeData = {
    heroKicker: 'Welcome to DocAssist',
    heroHeading: 'Your Health, \n Our #1 Priority',
    heroSubheading: 'Experience personalized and compassionate healthcare with <strong>Dr. Pritam Pattyanayek</strong>. We are dedicated to providing comprehensive medical services and consultations to help you achieve your best health.',
    heroImage: images.doctor_hero.src,
    heroImageHint: images.doctor_hero.hint,
    featuredBlogs: [
        {
            _id: '1',
            title: 'The Importance of Regular Check-ups',
            slug: 'regular-check-ups',
            mainImage: images.blog_main_1.src,
            imageHint: images.blog_main_1.hint,
            excerpt: 'Learn why regular health check-ups are crucial for preventive care and maintaining long-term wellness.',
        },
        {
            _id: '2',
            title: 'Nutrition Tips for a Healthy Heart',
            slug: 'nutrition-tips',
            mainImage: images.blog_main_2.src,
            imageHint: images.blog_main_2.hint,
            excerpt: 'Discover simple dietary changes you can make to improve cardiovascular health and reduce risks.',
        },
        {
            _id: '3',
            title: 'Managing Stress for Better Health',
            slug: 'managing-stress',
            mainImage: images.blog_main_3.src,
            imageHint: images.blog_main_3.hint,
            excerpt: 'Explore effective techniques for managing stress, a key factor in overall physical and mental well-being.',
        },
    ]
};

export const aboutData = {
    doctorName: 'Dr. Pritam Pattyanayek',
    image: images.doctor_about.src,
    imageHint: images.doctor_about.hint,
    missionStatement: 'Providing accessible, high-quality <span class="text-primary">healthcare</span> through evidence-based medicine and patient-centric care.',
    highlights: [
        '15+ years of clinical excellence in Internal Medicine.',
        'Specialized in Chronic Disease Management (Diabetes & Hypertension).',
        'Pioneer in Telemedicine & Digital Health in Purba Medinipur.',
        'Committed to preventive care and community health education.'
    ],
    services: [
        { title: 'General Consultation', description: 'Comprehensive physical exams and diagnosis.' },
        { title: 'Heart Health', description: 'Hypertension management and cardiovascular risk assessment.' },
        { title: 'Diabetes Care', description: 'Advanced blood sugar management and dietary planning.' },
        { title: 'Preventive Care', description: 'Early detection screenings and lifestyle counseling.' },
        { title: 'E-Prescriptions', description: 'Verified digital prescriptions delivered via secure app.' },
        { title: 'Follow-up Care', description: 'Dedicated post-consultation monitoring and support.' }
    ],
    bio: 'With over 15 years of experience, Dr. Pattyanayek is a respected name in Mahishadal and Nandakumar. He focuses on long-term wellness rather than just treating immediate symptoms.',
    education: 'MBBS from R.G. Kar Medical College, Kolkata',
    experience: '15+ Years',
    patientsServed: '2500+',
    positiveReviews: '98%',
    consultationsDone: '5000+',
};

export const pricingData = {
    title: 'Find the Right Plan for You',
    subtitle: 'We offer flexible consultation options to meet your needs, whether you prefer a quick chat, a video call, or an in-person visit.',
    pricingOptions: [
        {
            type: 'Chat',
            platform: 'via Mobile App',
            price: '₹200',
            description: 'Get quick medical advice and prescriptions for common ailments through a secure chat.',
            cta: 'Start a Chat',
            tag: 'Quick Help',
            features: ['24/7 Access', 'E-prescription Included', 'Follow-up Questions'],
        },
        {
            type: 'Video',
            platform: 'Google Meet / Zoom',
            price: '₹400',
            description: 'A detailed consultation with the doctor from the comfort of your home.',
            cta: 'Book a Video Call',
            tag: 'Most Popular',
            features: ['30-Minute Session', 'Comprehensive Diagnosis', 'Medication Review'],
        },
        {
            type: 'In-Clinic',
            platform: 'Visit Our Clinic',
            price: '₹500',
            description: 'A traditional, in-person appointment for a thorough physical examination.',
            cta: 'Book In-Clinic Visit',
            tag: 'Thorough',
            features: ['Physical Examination', 'Immediate Tests if needed', 'Personalized Care Plan'],
        },
    ],
    consultationFeatures: [
        {
            category: 'General',
            items: [
                { feature: 'Consultation Duration', chat: '15 mins', video: '30 mins', clinic: '30+ mins' },
                { feature: 'E-Prescription', chat: 'true', video: 'true', clinic: 'true' },
                { feature: 'Follow-up Included', chat: 'true', video: 'false', clinic: 'false' },
            ]
        },
        {
            category: 'Suitability',
            items: [
                { feature: 'Minor Ailments (Cold, Flu)', chat: 'true', video: 'true', clinic: 'true' },
                { feature: 'Chronic Condition Mgt.', chat: 'false', video: 'true', clinic: 'true' },
                { feature: 'Physical Examination', chat: 'false', video: 'false', clinic: 'true' },
            ]
        }
    ]
};

export const testimonialsData = [
    { _id: '1', name: 'Anjali S.', location: 'Mahishadal', rating: 5, date: '2024-07-15T10:00:00Z', avatar: images.patient_avatar_1.src, avatarHint: images.patient_avatar_1.hint, comment: 'Dr. Pattyanayek is incredibly patient and thorough. He listens to all my concerns and explains everything clearly. Highly recommended!' },
    { _id: '2', name: 'Rajesh K.', location: 'Nandakumar', rating: 5, date: '2024-07-10T14:30:00Z', avatar: images.patient_avatar_2.src, avatarHint: images.patient_avatar_2.hint, comment: 'The video consultation was so convenient! The doctor was punctual, and I got my prescription on my phone immediately.' },
    { _id: '3', name: 'Priya M.', location: 'Haldia', rating: 4, date: '2024-06-28T11:00:00Z', avatar: images.patient_avatar_3.src, avatarHint: images.patient_avatar_3.hint, comment: 'Good experience at the clinic. It was clean, and the staff was helpful. The wait time was a bit long, but the consultation was worth it.' },
    { _id: '4', name: 'Amit G.', location: 'Mahishadal', rating: 5, date: '2024-05-20T09:00:00Z', avatar: images.patient_avatar_4.src, avatarHint: images.patient_avatar_4.hint, comment: 'I used the chat feature for a minor issue, and it was surprisingly effective. Saved me a trip to the clinic. Great service!' },
    { _id: '5', name: 'Sunita D.', location: 'Tamluk', rating: 5, date: '2024-07-25T16:00:00Z', avatar: images.patient_avatar_5.src, avatarHint: images.patient_avatar_5.hint, comment: 'A very knowledgeable and compassionate doctor. He takes the time to understand the root cause of the problem.' },
];

export const clinicData = {
    clinicLocations: [
        { id: 1, name: 'Mahishadal Clinic', address: 'Kapashda, Mahishadal', pinCode: '721628', phone: '+91 12345 67890', email: 'mahishadal@docassist.com', timings: 'Mon-Fri: 9am - 5pm' },
        { id: 2, name: 'Nandakumar Clinic', address: 'Nandakumar Market', pinCode: '721632', phone: '+91 12345 67891', email: 'nandakumar@docassist.com', timings: 'Sat-Sun: 10am - 2pm' },
    ]
};

export const faqData = {
    faqs: [
        { question: 'What types of consultations do you offer?', answer: 'We offer three types of consultations: secure chat, video calls, and traditional in-clinic visits to suit your needs and convenience.' },
        { question: 'How do I book an appointment?', answer: 'You can book an appointment by clicking the "Book Now" or "Book an Appointment" buttons on our website. You will be prompted to log in or sign up, after which you can choose your preferred consultation type and time slot.' },
        { question: 'Can I get a prescription online?', answer: 'Yes, e-prescriptions are provided for chat and video consultations. These are valid and can be used at most pharmacies.' },
        { question: 'What are your clinic hours?', answer: 'Our Mahishadal clinic is open Monday to Friday, 9am to 5pm. The Nandakumar clinic is open on weekends, Saturday and Sunday, from 10am to 2pm.' },
        { question: 'Is my personal information secure?', answer: 'Absolutely. We use industry-standard encryption and follow strict data privacy policies to ensure all your personal and health information is kept secure and confidential.' },
    ]
};

export const bookingData = {
    title: 'Book a Video Consultation',
    subtitle: 'Choose a convenient time slot for your online appointment. All sessions are conducted via secure video call.',
    availableDates: [
        'August 1, 2024',
        'August 2, 2024',
        'August 5, 2024',
        'August 6, 2024',
        'August 7, 2024',
    ],
    timeSlots: [
        '10:00 AM - 10:30 AM',
        '10:30 AM - 11:00 AM',
        '11:00 AM - 11:30 AM',
        '02:00 PM - 02:30 PM',
        '02:30 PM - 03:00 PM',
        '03:00 PM - 03:30 PM',
    ],
    reasons: [
        'General Check-up',
        'Fever',
        'Headache',
        'Cold & Cough',
        'Stomach Pain',
        'Follow-up',
        'Other',
    ]
};


export const postsData = [
    {
        _id: '1',
        title: 'The Importance of Regular Check-ups',
        slug: 'regular-check-ups',
        mainImage: images.blog_main_1.src,
        imageHint: images.blog_main_1.hint,
        excerpt: 'Learn why regular health check-ups are crucial for preventive care and maintaining long-term wellness.',
        category: 'Preventive Care',
        date: '2024-07-20T10:00:00Z',
        publishedAt: '2024-07-20T10:00:00Z',
        authorName: 'Dr. Pritam Pattyanayek',
        body: [
          { _key: '1a', _type: 'block', style: 'normal', children: [{ _key: '1a1', _type: 'span', text: 'Regular check-ups are the cornerstone of preventive healthcare. They help detect potential issues early, often before symptoms appear.' }] },
          { _key: '2a', _type: 'block', style: 'h2', children: [{ _key: '2a1', _type: 'span', text: 'Key Benefits' }] },
          { _key: '3a', _type: 'block', listItem: 'bullet', children: [{ _key: '3a1', _type: 'span', text: 'Early detection of chronic diseases like diabetes and hypertension.' }] },
          { _key: '4a', _type: 'block', listItem: 'bullet', children: [{ _key: '4a1', _type: 'span', text: 'Establishing a baseline for your personal health metrics.' }] },
          { _key: '5a', _type: 'block', listItem: 'bullet', children: [{ _key: '5a1', _type: 'span', text: 'Direct access to professional medical advice and lifestyle counseling.' }] },
          { _key: '6a', _type: 'block', style: 'h2', children: [{ _key: '6a1', _type: 'span', text: 'What to Expect' }] },
          { _key: '7a', _type: 'block', style: 'normal', children: [{ _key: '7a1', _type: 'span', text: 'During your visit, your doctor will review your history, perform clinical tests, and provide a personalized care plan.' }] },
        ]
    },
    {
        _id: '2',
        title: 'Nutrition Tips for a Healthy Heart',
        slug: 'nutrition-tips',
        mainImage: images.blog_main_2.src,
        imageHint: images.blog_main_2.hint,
        excerpt: 'Discover simple dietary changes you can make to improve cardiovascular health and reduce risks.',
        category: 'Nutrition',
        date: '2024-07-15T11:00:00Z',
        publishedAt: '2024-07-15T11:00:00Z',
        authorName: 'Dr. Pritam Pattyanayek',
        body: [
            { _key: '1b', _type: 'block', style: 'normal', children: [{ _key: '1b1', _type: 'span', text: 'Maintaining a healthy heart starts with what you put on your plate. Small changes can lead to big improvements.' }] },
            { _key: '2b', _type: 'block', style: 'h2', children: [{ _key: '2b1', _type: 'span', text: 'Daily Dietary Goals' }] },
            { _key: '3b', _type: 'block', listItem: 'bullet', children: [{ _key: '3b1', _type: 'span', text: 'Increase intake of fiber-rich whole grains and leafy greens.' }] },
            { _key: '4b', _type: 'block', listItem: 'bullet', children: [{ _key: '4b1', _type: 'span', text: 'Choose healthy fats like those found in nuts and seeds.' }] },
            { _key: '5b', _type: 'block', listItem: 'bullet', children: [{ _key: '5b1', _type: 'span', text: 'Minimize sodium and processed sugars to control blood pressure.' }] }
        ]
    },
    {
        _id: '3',
        title: 'Managing Stress for Better Health',
        slug: 'managing-stress',
        mainImage: images.blog_main_3.src,
        imageHint: images.blog_main_3.hint,
        excerpt: 'Explore effective techniques for managing stress, a key factor in overall physical and mental well-being.',
        category: 'Mental Health',
        date: '2024-07-10T12:00:00Z',
        publishedAt: '2024-07-10T12:00:00Z',
        authorName: 'Dr. Pritam Pattyanayek',
        body: [
             { _key: '1c', _type: 'block', style: 'normal', children: [{ _key: '1c1', _type: 'span', text: 'Chronic stress affects every system in the body. Developing effective coping strategies is vital for long-term health.' }] },
             { _key: '2c', _type: 'block', style: 'h2', children: [{ _key: '2c1', _type: 'span', text: 'Stress Reduction Techniques' }] },
             { _key: '3c', _type: 'block', listItem: 'bullet', children: [{ _key: '3c1', _type: 'span', text: 'Practice mindful breathing for 10 minutes daily.' }] },
             { _key: '4c', _type: 'block', listItem: 'bullet', children: [{ _key: '4c1', _type: 'span', text: 'Maintain a regular sleep schedule (7-8 hours).' }] },
             { _key: '5c', _type: 'block', listItem: 'bullet', children: [{ _key: '5c1', _type: 'span', text: 'Stay physically active to release endorphins.' }] }
        ]
    },
     {
        _id: '4',
        title: 'The Rise of Telemedicine',
        slug: 'telemedicine-rise',
        mainImage: images.blog_main_4.src,
        imageHint: images.blog_main_4.hint,
        excerpt: 'How technology is changing the way we access healthcare, making it more convenient and accessible than ever before.',
        category: 'Healthcare',
        date: '2024-06-25T09:00:00Z',
        publishedAt: '2024-06-25T09:00:00Z',
        authorName: 'Dr. Pritam Pattyanayek',
        body: [
             { _key: '1d', _type: 'block', style: 'normal', children: [{ _key: '1d1', _type: 'span', text: 'Telemedicine is revolutionizing healthcare by breaking geographical barriers and offering unmatched convenience.' }] },
             { _key: '2d', _type: 'block', style: 'h2', children: [{ _key: '2d1', _type: 'span', text: 'Why Choose Digital Consults?' }] },
             { _key: '3d', _type: 'block', listItem: 'bullet', children: [{ _key: '3d1', _type: 'span', text: 'Immediate access to specialists from the comfort of your home.' }] },
             { _key: '4d', _type: 'block', listItem: 'bullet', children: [{ _key: '4d1', _type: 'span', text: 'Secure digital prescriptions sent directly to your phone.' }] },
             { _key: '5d', _type: 'block', listItem: 'bullet', children: [{ _key: '5d1', _type: 'span', text: 'Significant reduction in travel time and clinical wait times.' }] }
        ]
    }
];

export const categoriesData = ['All', 'Preventive Care', 'Nutrition', 'Mental Health', 'Healthcare'];

export const settingsData = {
    navLinks: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/clinic', label: 'Clinics' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
    ],
    clinicInfo: {
        address: 'Mahishadal & Nandakumar, Purba Medinipur',
        phone: '+91 12345 67890',
        email: 'contact@docassist.com',
    }
};
