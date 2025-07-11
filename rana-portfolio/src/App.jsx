import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Moon,
  Sun,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Facebook,
  ExternalLink,
  ArrowUp,
  Download,
  Code,
  Briefcase,
} from "lucide-react";
import profilePhoto from "./assets/profile-photo.png";
import "./App.css";

// Three.js Background Component
const ThreeBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Dynamically import Three.js to avoid SSR issues
    const initThree = async () => {
      try {
        const THREE = await import("three");

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement);
        }

        // Create floating particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(posArray, 3)
        );

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.005,
          color: 0x4f46e5,
          transparent: true,
          opacity: 0.8,
        });

        const particlesMesh = new THREE.Points(
          particlesGeometry,
          particlesMaterial
        );
        scene.add(particlesMesh);

        // Create geometric shapes
        const geometries = [
          new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.SphereGeometry(0.05, 8, 6),
          new THREE.ConeGeometry(0.05, 0.1, 6),
        ];

        const materials = [
          new THREE.MeshBasicMaterial({
            color: 0x4f46e5,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          }),
          new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          }),
          new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
          }),
        ];

        const shapes = [];
        for (let i = 0; i < 20; i++) {
          const geometry =
            geometries[Math.floor(Math.random() * geometries.length)];
          const material =
            materials[Math.floor(Math.random() * materials.length)];
          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.x = (Math.random() - 0.5) * 10;
          mesh.position.y = (Math.random() - 0.5) * 10;
          mesh.position.z = (Math.random() - 0.5) * 10;

          mesh.rotation.x = Math.random() * Math.PI;
          mesh.rotation.y = Math.random() * Math.PI;

          scene.add(mesh);
          shapes.push(mesh);
        }

        camera.position.z = 5;

        sceneRef.current = scene;
        rendererRef.current = renderer;

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);

          // Rotate particles
          particlesMesh.rotation.x += 0.001;
          particlesMesh.rotation.y += 0.001;

          // Animate shapes
          shapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 + index * 0.001;
            shape.rotation.y += 0.01 + index * 0.001;
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
          });

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.log("Three.js not available, using fallback background");
      }
    };

    initThree();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
      }}
    />
  );
};

// Scroll to Top Button Component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg transition-all   transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      } hover:scale-110 bg-primary hover:bg-primary/90`}
      size="icon"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

// Typing Animation Component
const TypingAnimation = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    currentIndex,
    isDeleting,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  return (
    <span className=" bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/cv_eng.pdf"; // এখন এটা root theke serve hobe
    link.download = "Rana-Islam-CV-English.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Three.js Background */}
      <ThreeBackground />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary animate-pulse">
                Rana Islam
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="hover:text-primary transition-all   px-3 py-2 rounded-md text-sm font-medium hover:scale-105"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-primary transition-all   px-3 py-2 rounded-md text-sm font-medium hover:scale-105"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("skills")}
                  className="hover:text-primary transition-all   px-3 py-2 rounded-md text-sm font-medium hover:scale-105"
                >
                  Skills
                </button>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="hover:text-primary transition-all   px-3 py-2 rounded-md text-sm font-medium hover:scale-105"
                >
                  Projects
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-primary transition-all   px-3 py-2 rounded-md text-sm font-medium hover:scale-105"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-9 h-9 hover:scale-110 transition-transform  "
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="w-9 h-9 hover:scale-110 transition-transform  "
                >
                  {isMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top  ">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              <button
                onClick={() => scrollToSection("home")}
                className="hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("skills")}
                className="hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Skills
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="hover:text-primary transition-colors block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 min-h-screen flex items-center justify-center relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8 animate-in fade-in duration-1000 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-in slide-in-from-bottom duration-1000 delay-300">
                  Hi, I'm{" "}
                  <span className=" bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Rana Islam
                  </span>
                </h1>
                <div className="text-xl sm:text-2xl text-muted-foreground animate-in slide-in-from-bottom duration-1000 delay-500">
                  I'm a{" "}
                  <TypingAnimation
                    texts={[
                      "Full Stack Developer",
                      "MERN Stack Expert",
                      "Web Developer",
                      "Problem Solver",
                    ]}
                  />
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl animate-in slide-in-from-bottom duration-1000 delay-700">
                  Creating beautiful, responsive web applications with modern
                  technologies. Passionate about turning ideas into reality
                  through clean, efficient code.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom duration-1000 delay-1000">
                <Button
                  onClick={() => scrollToSection("projects")}
                  size="lg"
                  className="text-lg px-8 py-3 hover:scale-105 transition-transform   bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  View My Work
                </Button>
                <Button
                  onClick={downloadCV}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 hover:scale-105 transition-transform   border-primary hover:bg-primary/10"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download CV
                </Button>
                <Button
                  onClick={() => scrollToSection("contact")}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3 hover:scale-105 transition-transform   border-primary hover:bg-primary/10"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {/* GitHub */}
                <a
                  href="https://github.com/ranaIslam01?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:scale-110 transition-transform hover:bg-primary/10"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/ranaislam2255"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:scale-110 transition-transform hover:bg-primary/10"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801840248746" // এখানে নিজের নম্বরটা international format এ দিস
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:scale-110 transition-transform hover:bg-primary/10"
                  >
                    <Phone className="h-5 w-5" />{" "}
                    {/* WhatsApp icon না থাকলে Phone use কর */}
                  </Button>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/tomar-username"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:scale-110 transition-transform hover:bg-primary/10"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center lg:justify-end animate-in slide-in-from-right duration-1000 delay-500">
              <div className="relative">
                {/* Animated border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-cyan-500 rounded-full animate-spin-slow p-1">
                  <div className="bg-background rounded-full h-full w-full"></div>
                </div>

                {/* Profile image */}
                <div className="relative z-10 w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-background shadow-2xl hover:scale-105 transition-transform duration-500">
                  <img
                    src={profilePhoto}
                    alt="Rana Islam - Full Stack Developer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce delay-1000"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-600 rounded-full animate-bounce delay-1500"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate developer with a strong foundation in computer science
              and web technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in slide-in-from-left duration-1000">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Background</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a Computer Science Engineering graduate from Thakurgaon
                  Polytechnic Institute, based in Dinajpur Sadar, Bangladesh. I
                  have completed my diploma and am passionate about creating
                  innovative web solutions using modern technologies.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">What I Do</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I specialize in full-stack web development using the MERN
                  stack (MongoDB, Express.js, React.js, Node.js). I love
                  building responsive, user-friendly applications that solve
                  real-world problems and provide excellent user experiences.
                </p>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border hover:shadow-lg transition-shadow   animate-in slide-in-from-right duration-1000">
              <h3 className="text-2xl font-semibold mb-6">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 hover:scale-105 transition-transform  ">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Dinajpur Sadar, Bangladesh</span>
                </div>
                <div className="flex items-center space-x-3 hover:scale-105 transition-transform  ">
                  <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">
                      🎓
                    </span>
                  </div>
                  <span>Diploma in CSE, Thakurgaon Polytechnic Institute</span>
                </div>
                <div className="flex items-center space-x-3 hover:scale-105 transition-transform  ">
                  <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">
                      💻
                    </span>
                  </div>
                  <span>MERN Stack Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Skills & Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I work with to bring ideas to life
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              // Skills data
              {
                name: "MongoDB",
                category: "Database",
                color: "from-green-500 to-green-600",
              },
              {
                name: "Express.js",
                category: "Backend",
                color: "from-gray-500 to-gray-600",
              },
              {
                name: "React.js",
                category: "Frontend",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Node.js",
                category: "Runtime",
                color: "from-green-600 to-green-700",
              },
              {
                name: "JavaScript",
                category: "Language",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                name: "HTML5",
                category: "Markup",
                color: "from-orange-500 to-orange-600",
              },
              {
                name: "CSS3",
                category: "Styling",
                color: "from-blue-400 to-blue-500",
              },
              {
                name: "Tailwind CSS",
                category: "Framework",
                color: "from-cyan-500 to-cyan-600",
              },
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all   text-center group hover:scale-105 animate-in fade-in duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:rotate-12 transition-transform  `}
                >
                  <span className="text-white font-bold text-lg">
                    {skill.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {skill.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Some of the projects I've worked on
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all   group hover:scale-105 animate-in slide-in-from-left duration-1000">
              <div className="space-y-4">
                <div className="h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  E-commerce Website
                </h3>
                <p className="text-muted-foreground">
                  Currently developing a full-featured e-commerce platform using
                  the MERN stack with modern UI/UX design and responsive layout.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors">
                    React
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors">
                    Node.js
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors">
                    MongoDB
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all   group hover:scale-105 animate-in slide-in-from-bottom duration-1000 delay-200">
              <div className="space-y-4">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  Portfolio Website
                </h3>
                <p className="text-muted-foreground">
                  This responsive portfolio website built with React, Tailwind
                  CSS, and Three.js featuring dark/light mode and smooth
                  animations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm hover:bg-cyan-500/20 transition-colors">
                    React
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm hover:bg-cyan-500/20 transition-colors">
                    Three.js
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-full text-sm hover:bg-cyan-500/20 transition-colors">
                    Tailwind
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all   group hover:scale-105 animate-in slide-in-from-right duration-1000 delay-400">
              <div className="space-y-4">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  More Projects Coming
                </h3>
                <p className="text-muted-foreground">
                  I'm constantly working on new projects and learning new
                  technologies. Check back soon for more exciting work!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors">
                    In Development
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's connect and discuss opportunities to work together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8 animate-in slide-in-from-left duration-1000">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform  ">
                    <div className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:dev.rana.cse@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        dev.rana.cse@gmail.com <br />
                        ranaislam600837@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform  ">
                    <div className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href="tel:+8801840248746"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +880 1840 248746 <br />
                        +880 1516596680
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 hover:scale-105 transition-transform  ">
                    <div className="bg-primary/10 p-3 rounded-lg hover:bg-primary/20 transition-colors">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        Dinajpur Sadar, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                <div className="flex space-x-4">
                  {/* GitHub */}
                  <a
                    href="https://github.com/ranaIslam01?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:scale-110 transition-transform hover:bg-primary/10"
                    >
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/ranaislam2255"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:scale-110 transition-transform hover:bg-primary/10"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/8801840248746" // এখানে নিজের নম্বরটা international format এ দিস
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:scale-110 transition-transform hover:bg-primary/10"
                    >
                      <Phone className="h-5 w-5" />{" "}
                      {/* WhatsApp icon না থাকলে Phone use কর */}
                    </Button>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/tomar-username"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:scale-110 transition-transform hover:bg-primary/10"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border hover:shadow-lg transition-shadow   animate-in slide-in-from-right">
              <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all   hover:border-primary/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all   hover:border-primary/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all   hover:border-primary/50"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform   bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 border-t border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2025 Rana Islam. All rights reserved. Made with Tailwind Css and
              React
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
