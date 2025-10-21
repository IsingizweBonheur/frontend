import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBriefcase, 
  faImages, 
  faCamera, 
  faPhone,
  faCalendarAlt,
  faEnvelope,
  faPhoneAlt,
  faComments,
  faBuilding,
  faClock,
  faStar,
  faChevronRight,
  faTimes,
  faExpand,
  faChevronLeft,
  faChevronRight as faChevronRightSolid,
  faRing,
  faUserSecret,
  faVideo,
  faFilm,
  faCameraRetro,
  faMagic,
  faCheck,
  faHeart,
  faShieldAlt,
  faRocket,
  faMoneyBillWave,
  faHeadset,
  faUserTie,
  faHeart as faHeartSolid,
  faGem,
  faPalette,
  faMusic,
  faTheaterMasks,
  faPhotoVideo
} from '@fortawesome/free-solid-svg-icons';
import { 
  faInstagram, 
  faFacebook, 
  faYoutube,
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';

export default function Homepage() {
  const [gallery, setGallery] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeService, setActiveService] = useState(0);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("all");
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookingMethod, setBookingMethod] = useState('whatsapp'); // 'whatsapp' or 'email'

  // Service icons mapping
  const serviceIcons = {
    'wedding': faRing,
    'portrait': faUserTie,
    'commercial': faBuilding,
    'event': faTheaterMasks,
    'video': faVideo,
    'film': faFilm,
    'creative': faPalette,
    'private': faUserSecret,
    'default': faCamera
  };

  // Service features mapping
  const serviceFeatures = {
    'wedding': [
      "Full day coverage (8-10 hours)",
      "2 professional photographers",
      "500+ high-resolution edited photos",
      "Online gallery with download access",
      "Engagement pre-shoot included",
      "Wedding album design consultation",
      "Same-day sneak peek photos",
      "All digital files with print rights"
    ],
    'portrait': [
      "1-2 hour professional session",
      "Multiple outfit changes",
      "Studio or outdoor location",
      "50+ professionally edited photos",
      "Online gallery delivery",
      "Print release for personal use",
      "Hair & makeup guidance",
      "Digital download within 7 days"
    ],
    'commercial': [
      "Professional lighting setup",
      "Product or corporate photography",
      "Brand consistency maintained",
      "High-resolution commercial license",
      "Fast turnaround (3-5 business days)",
      "Multiple format delivery",
      "Background removal service",
      "Social media optimized versions"
    ],
    'event': [
      "4-6 hours of coverage",
      "Candid and posed photography",
      "Multiple photographers available",
      "200+ edited high-resolution images",
      "Next-day sneak peek delivery",
      "Online gallery for guests",
      "Print and digital rights",
      "Event highlight video available"
    ],
    'video': [
      "4K Ultra HD quality",
      "Professional audio recording",
      "Multiple camera angles",
      "Color grading and correction",
      "Background music licensing",
      "3-5 minute highlight reel",
      "Full event footage available",
      "Delivery within 10-14 days"
    ],
    'default': [
      "Professional equipment setup",
      "High-quality edited deliverables",
      "Fast turnaround time",
      "Multiple revision rounds",
      "Online delivery system",
      "Print and digital rights",
      "Customer support",
      "Satisfaction guarantee"
    ]
  };

  // Firebase data fetching
  useEffect(() => {
    const galleryRef = dbRef(database, 'admin/gallery');
    onValue(galleryRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setGallery(arr.reverse());
    });

    const projectRef = dbRef(database, 'admin/projects');
    onValue(projectRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setProjects(arr.reverse());
    });

    const serviceRef = dbRef(database, 'admin/services');
    onValue(serviceRef, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      setServices(arr);
    });

    const profileRef = dbRef(database, 'admin/profile');
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProfile(data);
    });
  }, []);

  // Intersection Observer for active navigation
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  // Testimonials auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation items
  const navigationItems = [
    { id: 'home', name: 'Home', icon: faHome },
    { id: 'services', name: 'Services', icon: faBriefcase },
    { id: 'portfolio', name: 'Portfolio', icon: faImages },
    { id: 'gallery', name: 'Gallery', icon: faCamera },
    { id: 'contact', name: 'Contact', icon: faPhone }
  ];

  // Default testimonials
  const testimonials = [
    {
      name: "Sarah & James",
      company: "Wedding Clients",
      text: "Dev Studio captured our wedding day perfectly! The photos and video are absolutely stunning and we'll cherish them forever.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      company: "Private Session Client",
      text: "The private shooting session was amazing! The team made me feel comfortable and the results were beyond expectations.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Emma Rodriguez",
      company: "Commercial Client",
      text: "Professional, creative, and delivered exceptional quality on our commercial film project. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face"
    }
  ];

  // Default stats
  const stats = [
    { number: "500+", label: "Projects Completed", icon: faRocket },
    { number: "99%", label: "Client Satisfaction", icon: faHeart },
    { number: "50+", label: "Awards Won", icon: faStar },
    { number: "24/7", label: "Support Available", icon: faHeadset }
  ];

  // Expanded Sample gallery images with more images for each category
  const sampleGallery = [
    // Wedding Category (6 images)
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      title: "Romantic Wedding",
      category: "wedding"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1445452916036-9022dfd33aa8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      title: "Beach Wedding",
      category: "wedding"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80",
      title: "Traditional Celebration",
      category: "wedding"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Elegant Reception",
      category: "wedding"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "First Dance",
      category: "wedding"
    },

    // Portrait Category (6 images)
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Professional Headshot",
      category: "portrait"
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      title: "Urban Portrait",
      category: "portrait"
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Natural Light Portrait",
      category: "portrait"
    },
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Corporate Portrait",
      category: "portrait"
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      title: "Lifestyle Portrait",
      category: "portrait"
    },

    // Event Category (6 images)
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Corporate Event",
      category: "event"
    },
    {
      id: 14,
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Music Festival",
      category: "event"
    },
    {
      id: 15,
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Birthday Celebration",
      category: "event"
    },
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      title: "Product Launch",
      category: "event"
    },
    {
      id: 17,
      url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      title: "Charity Gala",
      category: "event"
    },
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Conference Event",
      category: "event"
    },

    // Commercial Category (6 images)
    {
      id: 19,
      url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      title: "Product Photography",
      category: "commercial"
    },
    {
      id: 20,
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Fashion Campaign",
      category: "commercial"
    },
    {
      id: 21,
      url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Brand Story",
      category: "commercial"
    },
    {
      id: 22,
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Corporate Branding",
      category: "commercial"
    },
    {
      id: 23,
      url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Architecture Shoot",
      category: "commercial"
    },
    {
      id: 24,
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      title: "Food Photography",
      category: "commercial"
    },

    // Creative Category (6 images)
    {
      id: 25,
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
      title: "Artistic Vision",
      category: "creative"
    },
    {
      id: 27,
      url: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Fine Art Photography",
      category: "creative"
    },
    {
      id: 28,
      url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Experimental Shoot",
      category: "creative"
    },
    {
      id: 29,
      url: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Abstract Composition",
      category: "creative"
    },
    {
      id: 30,
      url: "https://images.unsplash.com/photo-1554080353-321e452ccf19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      title: "Creative Portraiture",
      category: "creative"
    },

    // Video Category (6 images)
    {
      id: 31,
      url: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
      title: "Film Production",
      category: "video"
    },
    {
      id: 32,
      url: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2031&q=80",
      title: "Cinematic Wedding",
      category: "video"
    },
    {
      id: 33,
      url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Documentary Style",
      category: "video"
    },
    {
      id: 34,
      url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
      title: "Music Video",
      category: "video"
    },
    {
      id: 35,
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2059&q=80",
      title: "Corporate Video",
      category: "video"
    },
    {
      id: 36,
      url: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      title: "Short Film",
      category: "video"
    }
  ];

  // Contact handlers
  const handleWhatsAppBooking = (serviceType = "") => {
    const phoneNumber = profile.phone || "0795926508";
    const baseMessage = `Hello ${profile.studioName || 'Dev Studio'}!%0A%0AI'm interested in booking a session.%0A`;
    const serviceMessage = serviceType ? `Service: ${serviceType}%0A` : "";
    const fullMessage = `${baseMessage}${serviceMessage}%0APlease provide me with more information about availability and pricing.`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${fullMessage}`, '_blank');
  };

  const handleEmailBooking = (serviceType = "") => {
    const email = profile.email || "isingizwebonheur@gmail.com";
    const subject = `Booking Inquiry - ${serviceType || 'Photography Session'}`;
    const body = `Hello ${profile.studioName || 'Dev Studio'} Team,

I'm interested in booking a ${serviceType || 'photography session'} and would like to get more information about:

- Availability
- Pricing packages
- Session details
- Any requirements

Please get back to me with the available options.

Best regards`;

    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleBooking = (serviceType = "") => {
    if (bookingMethod === 'whatsapp') {
      handleWhatsAppBooking(serviceType);
    } else {
      handleEmailBooking(serviceType);
    }
  };

  const handleCall = () => {
    const phoneNumber = profile.phone || "0795926508";
    window.open(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    const email = profile.email || "isingizwebonheur@gmail.com";
    window.open(`mailto:${email}`);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  // Portfolio Modal Functions
  const openPortfolioModal = () => {
    setIsPortfolioModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePortfolioModal = () => {
    setIsPortfolioModalOpen(false);
    setSelectedProject(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto';
  };

  const openProjectDetail = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(projects.findIndex(p => p.id === project.id));
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projects.length);
    setSelectedProject(projects[(currentImageIndex + 1) % projects.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setSelectedProject(projects[(currentImageIndex - 1 + projects.length) % projects.length]);
  };

  // Get service icon based on title
  const getServiceIcon = (serviceTitle) => {
    const title = serviceTitle?.toLowerCase() || '';
    if (title.includes('wedding')) return serviceIcons.wedding;
    if (title.includes('portrait') || title.includes('private')) return serviceIcons.portrait;
    if (title.includes('commercial') || title.includes('business')) return serviceIcons.commercial;
    if (title.includes('event')) return serviceIcons.event;
    if (title.includes('video') || title.includes('film')) return serviceIcons.video;
    if (title.includes('creative')) return serviceIcons.creative;
    return serviceIcons.default;
  };

  // Get service features based on title
  const getServiceFeatures = (serviceTitle) => {
    const title = serviceTitle?.toLowerCase() || '';
    if (title.includes('wedding')) return serviceFeatures.wedding;
    if (title.includes('portrait') || title.includes('private')) return serviceFeatures.portrait;
    if (title.includes('commercial') || title.includes('business')) return serviceFeatures.commercial;
    if (title.includes('event')) return serviceFeatures.event;
    if (title.includes('video') || title.includes('film')) return serviceFeatures.video;
    return serviceFeatures.default;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {profile.studioName || 'Dev'}<span className="text-purple-600">Studio</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 transition-all font-medium group relative py-2 px-4 rounded-lg ${
                    activeSection === item.id
                      ? 'text-purple-600 bg-purple-50 shadow-sm border border-purple-200'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`text-sm transition-transform ${
                      activeSection === item.id ? 'scale-110 text-purple-600' : 'group-hover:scale-110'
                    }`} 
                  />
                  <span className="font-semibold">{item.name}</span>
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-purple-600 rounded-full transition-all ${
                    activeSection === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                  }`}></div>
                </button>
              ))}
              <button
                onClick={() => handleBooking()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2 group"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="group-hover:scale-110 transition-transform" />
                <span>Book Session</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-3 transition-all font-medium py-3 px-4 rounded-lg ${
                      activeSection === item.id
                        ? 'text-purple-600 bg-purple-50 shadow-sm border border-purple-200'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`text-lg ${activeSection === item.id ? 'text-purple-600' : ''}`} 
                    />
                    <span className="font-semibold">{item.name}</span>
                    {activeSection === item.id && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full ml-auto"></div>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => handleBooking()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-center mt-2 flex items-center justify-center space-x-2"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Book Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Capture Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Beautiful Moments
                </span>
              </h1>
              <p className="text-xl text-purple-200 mt-6 mb-8 leading-relaxed">
                {profile.description || "Professional photography and film studio specializing in weddings, private sessions, and commercial productions. We transform your moments into timeless memories."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleBooking()}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="group-hover:scale-110 transition-transform" />
                  <span>Book Your Session</span>
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-lg hover:bg-purple-400 hover:text-white transition-all font-semibold text-center group"
                >
                  <span className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faComments} className="group-hover:scale-110 transition-transform" />
                    <span>Free Consultation</span>
                  </span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-12">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                      <FontAwesomeIcon icon={stat.icon} className="text-purple-300" />
                      <span>{stat.number}</span>
                    </div>
                    <div className="text-sm text-purple-200 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {services.slice(0, 4).map((service, index) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setActiveService(index);
                        scrollToSection('services');
                      }}
                      className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                    >
                      <div className="text-2xl mb-2 text-white group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={getServiceIcon(service.title)} />
                      </div>
                      <h3 className="font-semibold text-sm text-white">{service.title?.split(' ')[0] || 'Service'}</h3>
                      <p className="text-xs text-purple-200 mt-1">{service.title?.split(' ').slice(1).join(' ') || 'Details'}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-purple-300 flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>Trusted by 500+ clients worldwide</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={stat.icon} className="text-purple-500" />
                  <span>{stat.number}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Photography & Film Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional photography and videography services to capture your most precious moments
            </p>
          </div>

          {services.length > 0 ? (
            <>
              {/* Service Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(index)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                      activeService === index
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-2 border-purple-500'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <FontAwesomeIcon icon={getServiceIcon(service.title)} className="text-sm" />
                    <span>{service.title || 'Service'}</span>
                  </button>
                ))}
              </div>

              {/* Active Service Details */}
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-6xl mb-4 text-purple-600">
                      <FontAwesomeIcon icon={getServiceIcon(services[activeService]?.title)} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {services[activeService]?.title || 'Service Title'}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {services[activeService]?.description || 'Service description will appear here.'}
                    </p>
                    {services[activeService]?.price && (
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                        {services[activeService].price}
                      </div>
                    )}
                    
                    {/* Booking Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Book via:
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setBookingMethod('whatsapp')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            bookingMethod === 'whatsapp'
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} className={bookingMethod === 'whatsapp' ? 'text-green-500' : ''} />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => setBookingMethod('email')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            bookingMethod === 'email'
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faEnvelope} className={bookingMethod === 'email' ? 'text-blue-500' : ''} />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBooking(services[activeService]?.title)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold inline-flex items-center shadow-lg hover:shadow-xl group"
                    >
                      Book Now
                      <FontAwesomeIcon icon={faChevronRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                      <span>What's Included:</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {getServiceFeatures(services[activeService]?.title).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* All Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all group cursor-pointer"
                    onClick={() => setActiveService(index)}
                  >
                    <div className="text-4xl mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                      <FontAwesomeIcon icon={getServiceIcon(service.title)} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title || 'Service Title'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {service.description || 'Service description will appear here.'}
                    </p>
                    <div className="text-purple-600 font-semibold flex items-center group-hover:text-purple-700">
                      View Details
                      <FontAwesomeIcon icon={faChevronRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-purple-600">
                <FontAwesomeIcon icon={faCamera} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Services Available</h3>
              <p className="text-gray-600">Services will be displayed here once added to the system.</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our collection of stunning photography and videography work
            </p>
          </div>

          {/* Gallery Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'wedding', 'portrait', 'event', 'commercial', 'creative', 'video'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedGalleryCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all capitalize ${
                  selectedGalleryCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Work' : category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(gallery.length > 0 ? gallery : sampleGallery)
              .filter(item => selectedGalleryCategory === 'all' || item.category === selectedGalleryCategory)
              .map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
              >
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors">
                    <FontAwesomeIcon icon={faExpand} className="text-purple-600 text-sm" />
                  </div>
                </div>
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 delay-100">
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {gallery.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-purple-600">
                <FontAwesomeIcon icon={faImages} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Sample Gallery</h3>
              <p className="text-gray-600">Your gallery items will be displayed here once added to the system.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section - Updated with Booking Method Selection */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Let's Create Magic Together
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Ready to capture your special moments? Get in touch with us for a free consultation and booking.
              </p>
              
              {/* Booking Method Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Booking Method:
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setBookingMethod('whatsapp')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all flex-1 justify-center ${
                      bookingMethod === 'whatsapp'
                        ? 'bg-green-50 border-green-500 text-green-700 shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className={bookingMethod === 'whatsapp' ? 'text-green-500 text-xl' : 'text-xl'} />
                    <span className="font-semibold">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setBookingMethod('email')}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all flex-1 justify-center ${
                      bookingMethod === 'email'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className={bookingMethod === 'email' ? 'text-blue-500 text-xl' : 'text-xl'} />
                    <span className="font-semibold">Email</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    rows="6"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Tell us about your project, preferred dates, and any specific requirements..."
                  ></textarea>
                </div>
                
                <button
                  onClick={() => handleBooking()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  {bookingMethod === 'whatsapp' ? (
                    <>
                      <FontAwesomeIcon icon={faWhatsapp} className="group-hover:scale-110 transition-transform" />
                      <span>Send Message via WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faEnvelope} className="group-hover:scale-110 transition-transform" />
                      <span>Send Email Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleEmail}>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all group-hover:scale-110">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <p className="text-purple-100">{profile.email || 'isingizwebonheur@gmail.com'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 cursor-pointer group" onClick={handleCall}>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all group-hover:scale-110">
                      <FontAwesomeIcon icon={faPhoneAlt} />
                    </div>
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <p className="text-purple-100">{profile.phone || '0795926508'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => handleWhatsAppBooking()}>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all group-hover:scale-110">
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                    <div>
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-purple-100">Instant Booking & Support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faBuilding} />
                    </div>
                    <div>
                      <p className="font-semibold">Visit Our Studio</p>
                      <p className="text-purple-100">{profile.address || '123 Creative Avenue, Studio City'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                      <p className="font-semibold">Working Hours</p>
                      <p className="text-purple-100">Mon - Sun: 8AM - 10PM<br />24/7 Emergency Shoots</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20">
                  <h4 className="font-semibold mb-4 flex items-center space-x-2">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>Why Choose {profile.studioName || 'Dev Studio'}?</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { text: 'Professional Equipment', icon: faCamera },
                      { text: 'Creative Team', icon: faRocket },
                      { text: 'Fast Delivery', icon: faClock },
                      { text: 'Affordable Pricing', icon: faMoneyBillWave },
                      { text: 'Quality Guarantee', icon: faShieldAlt },
                      { text: '24/7 Support', icon: faHeadset }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={item.icon} className="w-3 h-3 text-white" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Capture Your Moments?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust us with their precious moments. 
            Let's create beautiful memories together.
          </p>
          
          {/* Booking Method Selection */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
              <div className="flex space-x-2">
                <button
                  onClick={() => setBookingMethod('whatsapp')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    bookingMethod === 'whatsapp'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={() => setBookingMethod('email')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    bookingMethod === 'email'
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleBooking()}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 group"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="group-hover:scale-110 transition-transform" />
              <span>Book Your Session</span>
            </button>
            <button
              onClick={handleCall}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all font-semibold flex items-center justify-center space-x-2 group"
            >
              <FontAwesomeIcon icon={faPhoneAlt} className="group-hover:scale-110 transition-transform" />
              <span>Call Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                </div>
                <div className="text-xl font-bold">
                  {profile.studioName || 'Dev'}<span className="text-purple-400">Studio</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {profile.description || 'Professional photography and film studio capturing your most precious moments with creativity and passion.'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                {services.slice(0, 4).map(service => (
                  <li key={service.id}>
                    <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors text-left flex items-center space-x-2">
                      <FontAwesomeIcon icon={getServiceIcon(service.title)} className="text-sm" />
                      <span>{service.title || 'Service'}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                {navigationItems.map(item => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="hover:text-white transition-colors text-left flex items-center space-x-2">
                      <FontAwesomeIcon icon={item.icon} className="text-sm" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2 cursor-pointer group" onClick={handleEmail}>
                  <FontAwesomeIcon icon={faEnvelope} className="group-hover:text-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">{profile.email || 'isingizwebonheur@gmail.com'}</span>
                </li>
                <li className="flex items-center space-x-2 cursor-pointer group" onClick={handleCall}>
                  <FontAwesomeIcon icon={faPhoneAlt} className="group-hover:text-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">{profile.phone || '0795926508'}</span>
                </li>
                <li className="flex items-center space-x-2 cursor-pointer group" onClick={() => handleWhatsAppBooking()}>
                  <FontAwesomeIcon icon={faWhatsapp} className="group-hover:text-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">WhatsApp Booking</span>
                </li>
                <li className="flex space-x-4 mt-3">
                  {[
                    { icon: faInstagram, name: 'Instagram' },
                    { icon: faFacebook, name: 'Facebook' },
                    { icon: faYoutube, name: 'YouTube' },
                    { icon: faWhatsapp, name: 'WhatsApp' }
                  ].map((social, index) => (
                    <button key={social.name} className="hover:text-purple-400 transition-colors p-2">
                      <FontAwesomeIcon icon={social.icon} className="text-lg" />
                    </button>
                  ))}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {profile.studioName || 'Dev Studio'}. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
