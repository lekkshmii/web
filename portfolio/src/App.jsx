import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronsDown, Mail, Linkedin, Github, ExternalLink, Award, Code, Briefcase, User } from 'lucide-react';
import * as THREE from 'three';

// Enhanced portfolio data
const portfolioData = {
  name: "Lekshmi Madhusudhanan",
  title: "ML Engineer & Quantitative Developer",
  subtitle: "Building intelligent systems at the intersection of finance and technology",
  about: "Naval Architecture & Ocean Engineering student at IIT Madras with expertise in machine learning, quantitative finance, and algorithmic trading. I build production-grade systems that get acquired, win global hackathons, and solve real-world problems with measurable impact.",
  
  stats: [
    { number: "5", label: "Systems Acquired/Adopted", icon: Award },
    { number: "200+", label: "LeetCode Problems", icon: Code },
    { number: "3", label: "Global Hackathon Wins", icon: Award },
    { number: "2B+", label: "Addressable Market Identified", icon: Briefcase }
  ],

  experience: [
    {
      role: "Machine Learning Intern",
      company: "Tyche",
      date: "Jun 2025 - Aug 2025",
      description: "Built advanced cash flow prediction system with LSTM and Prophet models. Engineered complete time-series forecasting pipeline with comprehensive evaluation framework.",
      tech: ["LSTM", "Prophet", "NumPy", "Pandas", "R²/MSE/RMSE"]
    },
    {
      role: "Investment Banking Virtual Experience",
      company: "J.P. Morgan Chase",
      date: "Dec 2024 - Jan 2025",
      description: "Identified and valued optimal M&A targets through strategic assessment and DCF modeling with competitor analysis.",
      tech: ["DCF Modeling", "Strategic Analysis", "Valuation"]
    }
  ],

  projects: [
    {
      title: "Meridian",
      subtitle: "M&A Intelligence Platform",
      description: "Built production ML system processing 1,000+ companies with real-time screening. Acquired by institutional client after identifying $2B+ addressable market.",
      impact: "Acquired in 3 months",
      tech: ["ML", "Product Management", "Statistical Ranking"],
      gradient: "from-purple-600 to-blue-600"
    },
    {
      title: "NeMo", 
      subtitle: "Multi-Modal Financial AI",
      description: "Architected RAG system processing financial PDFs with 95% citation accuracy. Reduced processing costs by 70% with hybrid architecture.",
      impact: "95% accuracy",
      tech: ["RAG", "Multi-Modal AI", "FastAPI", "Docker"],
      gradient: "from-cyan-600 to-teal-600"
    },
    {
      title: "Astra",
      subtitle: "Algorithmic Trading Engine", 
      description: "High-frequency trading system with microsecond latency. Built Monte Carlo risk engine with real-time VaR calculations.",
      impact: "Microsecond latency",
      tech: ["Rust", "WebAssembly", "Monte Carlo", "Risk Management"],
      gradient: "from-orange-600 to-red-600"
    },
    {
      title: "Skye",
      subtitle: "Mathematical Risk Platform",
      description: "Implemented Random Matrix Theory for cleaning correlation matrices. Achieved 85% accuracy in predicting market regime changes.",
      impact: "85% accuracy",
      tech: ["Random Matrix Theory", "Network Analysis", "NumPy"],
      gradient: "from-indigo-600 to-purple-600"
    }
  ],

  skills: {
    "Languages": ["Python", "Rust", "C", "R", "SQL", "JavaScript"],
    "ML/AI": ["TensorFlow", "scikit-learn", "Hugging Face", "LSTM", "Prophet"],
    "Finance": ["QuantLib", "Risk Management", "Statistical Inference", "FRM"],
    "Tools": ["FastAPI", "Docker", "MongoDB", "Power BI", "Figma", "Excel VBA"]
  },

  achievements: [
    "State Rank 1 in Class XII (Self-study)",
    "Top 8% JEE Mains, Top 9% JEE Advanced",
    "Top 5 Finalist: Vectara & LlamaIndex Hackathon (2,000+ participants)", 
    "Top 10 Finalist: Mistral AI Hackathon",
    "Global Top 50: Tokyo Dome XR Hackathon"
  ]
};

// 3D Scene Component
const ThreeScene = ({ scrollY }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.6),
      new THREE.IcosahedronGeometry(0.4)
    ];

    const shapes = [];
    for(let i = 0; i < 8; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL((i * 0.1) + 0.6, 0.7, 0.6),
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      
      shapes.push(mesh);
      scene.add(mesh);
    }

    camera.position.z = 5;

    sceneRef.current = { scene, camera, renderer, particlesMesh, shapes };
    rendererRef.current = renderer;
    particlesRef.current = particlesMesh;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.001;
        particlesRef.current.rotation.x += 0.0005;
      }

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 + index * 0.001;
        shape.rotation.y += 0.01 + index * 0.001;
        shape.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current) {
        const { camera, renderer } = sceneRef.current;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

// Enhanced Header
const Header = ({ scrollTo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('landing');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['landing', 'about', 'experience', 'projects', 'skills', 'contact'];
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }
      if(currentSection) {
          setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex-shrink-0 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollTo('landing')}
          >
            <div className="relative">
              <span className="text-white font-bold text-2xl tracking-tight">LM</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === item.id 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Icon size={16} />
                  {item.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

// Enhanced Landing Section with 3D
const LandingSection = ({ scrollTo }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section id="landing" className="h-screen w-full relative flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      {/* 3D Background */}
      <div className="absolute inset-0">
        <ThreeScene scrollY={scrollY} />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            y
          }}
        />
      </div>

      <motion.div 
        className="z-10 relative text-center max-w-6xl mx-auto px-6"
        style={{ y, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            {portfolioData.name.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 + 0.5 }}
              >
                {word}{i === 0 && <br className="hidden md:block"/>}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-300">
            {portfolioData.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {portfolioData.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={() => scrollTo('projects')}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button 
            onClick={() => scrollTo('contact')}
            className="px-8 py-4 border-2 border-white/20 rounded-xl font-semibold text-lg backdrop-blur-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            Get In Touch
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
      >
        <motion.button 
          onClick={() => scrollTo('about')}
          className="flex flex-col items-center group"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-gray-400 text-sm mb-2 group-hover:text-white transition-colors">Scroll to explore</span>
          <ChevronsDown size={24} className="text-gray-400 group-hover:text-white transition-colors" />
        </motion.button>
      </motion.div>
    </section>
  );
};

// Animated Section Wrapper
const AnimatedSection = ({ children, id, className = "" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`relative py-24 px-6 md:px-8 ${className}`}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 1, staggerChildren: 0.2 } },
        hidden: { opacity: 0, y: 100 },
      }}
    >
      {children}
    </motion.section>
  );
};

// Stats Component
const StatsSection = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
    {portfolioData.stats.map((stat, index) => {
      const Icon = stat.icon;
      return (
        <motion.div
          key={index}
          className="text-center group"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 group-hover:border-purple-500/50 transition-all duration-300">
            <Icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
            <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

// Enhanced About Section
const AboutSection = () => (
  <AnimatedSection id="about" className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen flex items-center">
    <div className="container mx-auto">
      <motion.h2 
        className="text-5xl md:text-7xl font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        About Me
      </motion.h2>
      
      <StatsSection />

      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          className="relative flex-shrink-0"
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: -100 },
          }}
        >
          <div className="relative w-80 h-80 rounded-3xl overflow-hidden border-4 border-gray-800">
            <img
              src="https://placehold.co/400x400/1a1a1a/ffffff?text=LM"
              alt="Lekshmi Madhusudhanan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
          </div>
          
          {/* Floating achievement badges */}
          <motion.div 
            className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Award className="w-6 h-6 text-black" />
          </motion.div>
        </motion.div>

        <motion.div 
          className="max-w-2xl text-center lg:text-left"
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 0, x: 100 },
          }}
        >
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            {portfolioData.about}
          </p>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Key Achievements</h3>
            {portfolioData.achievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-300">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

// Enhanced Projects Section
const ProjectsSection = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1]);

  return (
    <AnimatedSection id="projects" className="bg-black text-white min-h-screen">
      <motion.div className="container mx-auto" style={{ scale }}>
        <motion.h2 
          className="text-5xl md:text-7xl font-bold mb-20 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
        >
          Featured Projects
        </motion.h2>
        
        <div className="space-y-32">
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex-1 space-y-6">
                <div>
                  <motion.h3 
                    className="text-4xl md:text-5xl font-bold mb-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-xl text-gray-400 mb-4">{project.subtitle}</p>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                  {project.description}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${project.gradient} text-white font-semibold`}>
                    {project.impact}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>

                <motion.button
                  className="flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  Learn More <ExternalLink size={16} className="group-hover:rotate-45 transition-transform" />
                </motion.button>
              </div>

              <motion.div 
                className="flex-1 max-w-lg"
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br ${project.gradient} p-[1px]`}>
                  <div className="bg-gray-900 rounded-2xl p-8">
                    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${project.gradient} mx-auto mb-4 flex items-center justify-center`}>
                          <Code className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-white">{project.title}</h4>
                        <p className="text-gray-400 text-sm mt-2">{project.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

// Enhanced Skills Section
const SkillsSection = () => (
  <AnimatedSection id="skills" className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen flex items-center">
    <div className="container mx-auto">
      <motion.h2 
        className="text-5xl md:text-7xl font-bold mb-20 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        Technical Arsenal
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {Object.entries(portfolioData.skills).map(([category, skills], categoryIndex) => (
          <motion.div
            key={category}
            className="space-y-4"
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 },
            }}
            transition={{ delay: categoryIndex * 0.2 }}
          >
            <h3 className="text-xl font-bold text-purple-400 mb-6 text-center">{category}</h3>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center group-hover:border-purple-500/50 group-hover:bg-gray-700/50 transition-all duration-300">
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {skill}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </AnimatedSection>
);

// Enhanced Contact Section
const ContactSection = () => (
  <AnimatedSection id="contact" className="bg-gradient-to-br from-black via-gray-900 to-purple-900/20 text-white min-h-screen flex items-center">
    <div className="container mx-auto text-center">
      <motion.h2 
        className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        Let's Connect
      </motion.h2>
      
      <motion.p 
        className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 30 },
        }}
      >
        Ready to build something extraordinary together? Whether it's machine learning, fintech innovation, or the next big idea - let's make it happen.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 30 },
        }}
      >
        <motion.a
          href="mailto:lekshmi@example.com"
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Mail size={20} />
            Send Email
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.a>

        <motion.a
          href="#"
          className="px-8 py-4 border-2 border-purple-500/50 rounded-xl font-semibold text-lg backdrop-blur-sm hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Github size={20} />
          View GitHub
        </motion.a>
      </motion.div>

      <div className="flex justify-center gap-8">
        {[
          { icon: Mail, href: "mailto:lekshmi@example.com", label: "Email" },
          { icon: Linkedin, href: "#", label: "LinkedIn" },
          { icon: Github, href: "#", label: "GitHub" }
        ].map((social, index) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={index}
              href={social.href}
              className="group relative p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.1 }}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 },
              }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {social.label}
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  </AnimatedSection>
);

// Enhanced Experience Section
const ExperienceSection = () => (
  <AnimatedSection id="experience" className="bg-gray-900 text-white">
    <div className="container mx-auto">
      <motion.h2 
        className="text-5xl md:text-7xl font-bold mb-16 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        Experience
      </motion.h2>
      
      <div className="max-w-4xl mx-auto relative">
        {/* Timeline Line in the background */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
        <div className="space-y-16">
          {portfolioData.experience.map((job, index) => (
            <motion.div
              key={index}
              className="relative pl-16"
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 100 },
              }}
              transition={{ delay: index * 0.3 }}
            >
              <div className="absolute left-0 top-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 border-4 border-gray-900">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 group hover:border-purple-500/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {job.role}
                    </h3>
                    <p className="text-lg text-purple-400">{job.company}</p>
                  </div>
                  <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-lg text-sm flex-shrink-0">{job.date}</span>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-4">{job.description}</p>
                
                {job.tech && (
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-900/30 border border-purple-700/50 rounded text-xs text-purple-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </AnimatedSection>
);

// Main App Component
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-white text-lg">Loading experience...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black font-sans leading-normal tracking-normal overflow-x-hidden">
      <Header scrollTo={scrollTo} />
      <main>
        <LandingSection scrollTo={scrollTo} />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      
      <footer className="bg-black py-8 text-center border-t border-gray-800">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} {portfolioData.name}. Crafted with innovation.</p>
      </footer>
    </div>
  );
}
