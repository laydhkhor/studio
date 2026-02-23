
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
    missionStatement: 'Our mission is to provide accessible, high-quality <span class="text-primary">healthcare</span> to our community. We believe in a patient-centric approach, where your <span class="text-primary">health</span> and comfort are our top <span class="text-primary">priorities</span>. <span class="font-semibold text-primary">Dr. Pattyanayek</span> is committed to building lasting relationships with his patients.',
    bio: 'With over 15 years of experience in internal medicine, Dr. Pattyanayek is a respected and trusted name in the Mahishadal and Nandakumar regions. He is passionate about preventive care and empowering his patients with the knowledge to lead healthier lives.',
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
          { _key: '1a', _type: 'block', style: 'normal', children: [{ _key: '1a1', _type: 'span', text: 'Regular health check-ups are one of the most important steps you can take to manage your health. They are a cornerstone of preventive medicine, helping to detect potential health issues before they become serious problems. Many chronic diseases, such as diabetes, hypertension, and heart disease, can develop silently without any noticeable symptoms in their early stages.' }] },
          { _key: '2a', _type: 'block', style: 'h2', children: [{ _key: '2a1', _type: 'span', text: 'What Happens During a Check-up?' }] },
          { _key: '3a', _type: 'block', style: 'normal', children: [{ _key: '3a1', _type: 'span', text: 'During a routine check-up, your doctor will typically perform a physical exam, review your medical history, and discuss your lifestyle. Depending on your age and risk factors, they may also recommend specific screenings, such as blood pressure checks, cholesterol tests, and cancer screenings. This is also an excellent opportunity to discuss any health concerns you may have and receive personalized advice on diet, exercise, and stress management.' }] },
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
            { _key: '1b', _type: 'block', style: 'normal', children: [{ _key: '1b1', _type: 'span', text: 'A heart-healthy diet is a powerful tool in the fight against cardiovascular disease. By making smart food choices, you can control risk factors like high cholesterol, blood pressure, and excess weight. The key is not about strict limitations, but about focusing on fresh, whole foods.' }] }
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
             { _key: '1c', _type: 'block', style: 'normal', children: [{ _key: '1c1', _type: 'span', text: 'In today\'s fast-paced world, stress has become a common part of life. While a little stress can be motivating, chronic stress can have a significant negative impact on both your mental and physical health. Learning to manage stress effectively is crucial for long-term well-being.' }] }
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
             { _key: '1d', _type: 'block', style: 'normal', children: [{ _key: '1d1', _type: 'span', text: 'Telemedicine, or the practice of caring for patients remotely, has seen a dramatic rise in popularity. It offers a convenient way to receive medical advice, diagnoses, and prescriptions without leaving your home. This technology is particularly beneficial for routine follow-ups, managing chronic conditions, and for those with mobility challenges.' }] }
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
