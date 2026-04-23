// Natives
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LucideArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL, RECAPTCHA_SITE_KEY } from "@/config";
import { useToast } from "@/hooks/use-toast";

// Components
import Navbar from "@/components/Navbar";
import ParticleCollision from "@/components/ParticleCollision";
import SimulationMode from "@/components/SimulationMode";

// Assets
import aboutPortrait from "@/assets/about-portrait.jpg";
import dataCent from "@/assets/datacent.png";
import chefsPic from "@/assets/chefs-pic.png";
import aslingo from "@/assets/aslingo.jpg"
import portfolioWebsite from "@/assets/portfolio-website.png";
import exp1 from "@/assets/shopify.svg";
import exp2 from "@/assets/cibc.png";
import exp3 from "@/assets/innovibe.png";
import exp4 from "@/assets/roblox.jpg";
import ChatWidget from "@/components/ChatWidget";
import LinkChip from "@/components/LinkChip";
import HoverButton from "@/components/HoverButton";

const EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

const experience = [
  {
    title: "Shopify",
    subtitle: "Software Engineering Intern",
    location: "Toronto, Ontario",
    date: "May 2025 - Aug 2025",
    year: "2025",
    description:
      "Built and scaled security infrastructure software handling 100M+ requests/min across 175 countries.",
    fullDescription:
      "Led development on Web Application Firewall tooling handling over 100M requests per minute using JavaScript and Ruby with a test-driven approach. Delivered features to an open-source circuit breaker used by 230+ organizations. Presented bot-protection optimizations to 100+ engineers, reducing database load using Ruby, SQL and Terraform. Handled 15+ production incidents during on-call using Grafana, Solarwinds, Bugsnag and Cloudflare. Prototyped global networking infrastructure spanning 175+ countries in a 3-day sprint.",
    image: exp1,
    caseStudy: "https://github.com/Shopify/semian/pull/606",
    tags: ["JavaScript", "Ruby", "MySQL", "Redis", "GCP", "Cloudflare", "Terraform", "Distributed Systems"],
  },
  {
    title: "CIBC",
    subtitle: "Software Developer Intern",
    date: "Sep 2023 - Apr 2024",
    location: "Toronto, Ontario",
    year: "2024",
    description:
      "Built data migration and validation systems for large-scale cloud transformation to Azure, resulting in 12x faster SIT tests.",
    fullDescription:
      "Contributed to a long-term data migration project moving on-premise systems to Azure through Agile sprints. Built an intelligent testing framework using Python, SQL, PySpark and GitHub Workflows, reducing validation time by ~12x. Presented a live demo of the system to 80+ developers, analysts and team leads.",
    image: exp2,
    tags: ["Python", "PySpark", "Scala", "Microsoft SQL Server", "Databricks", "Azure", "Data Systems"],
  },
  {
    title: "Innovibe",
    subtitle: "Software Developer Intern",
    date: "May 2023 — Aug 2023",
    location: "Vancouver, British Columbia",
    year: "2023",
    description:
      "Lead development of a full-stack application serving 4K+ users, across 10+ branches, with real-time features.",
    fullDescription:
      "Led development of a multi-platform application using Swift, React, Go, Docker and GraphQL. Delivered client-facing features used by 4K+ customers across 10+ branches, including real-time progress tracking and booking systems. Worked in fast-paced Scrum cycles to ship features consistently.",
    
    image: exp3,
    tags: ["React", "React Native", "Go", "Swift", "GraphQL", "PostgreSQL", "Docker", "AWS", "Full Stack"],
  },
  {
    title: "Roblox",
    subtitle: "Software Developer Intern",
    location: "San Mateo, California",
    date: "May 2022 — Jul 2022",
    year: "2022",
    description:
      "Implemented scalable game systems serving 6K+ users sponsored by Roblox and collaborated with Roblox Engine Team on QA issues.",
    fullDescription:
      "Designed and developed a game system using Lua, including database controllers and networking modules across 10K+ lines of production code. Reached 6K+ potential users and presented to 100+ engineers. Identified and resolved a state-persistence issue in shared modules in collaboration with the Roblox engine team.",
    image: exp4,
    caseStudy: "https://x.com/TeamPolybyte/status/1548454156951642113",
    tags: ["Lua", "Games Development", "Database Management", "Networking", "Physics", "Graphics Performance"],
  },
];

const featuredProjects = [
  {
    title: "DataCent",
    category: "Hackathon Project",
    description:
     "Using a clever clustering algorithm and AI-reinforced feedback, DataCent helps you best serve your current and future clients by optimizing data center locations. DataCent considers every angle of infrastructure, from the proximity to your clients, to the energy saved in comparison to existing or planned infrastructure, to the large cost reductions as a result.",
    image: dataCent,
    tags: ["Python", "JavaScript", "React", "MongoDB", "FastAPI", "AWS", "Gemini"],
    link: "https://devpost.com/software/datacent",
  },
  {
    title: "Chef's Pic",
    category: "Hackthon Project",
    description:
      "Using real-time image capture and generative AI, Chef's Pic is your personal chef and nutritionist. It breaks down the most complex of foods for all diets, from vegetarians to diabetics, so that they can better understand the food that they eat.",
    image: chefsPic,
    tags: ["Python", "TypeScript", "React Native", "MongoDB", "FastAPI", "AWS", "Gemini"],
    link: "https://devpost.com/software/chef-s-pic",
  },
  {
    title: "ASLingo",
    category: "Hackathon Project",
    description:
      "Using custom training models, ASLingo is the premier camera-based AI platform, helping enhance your ASL through mastery-based tasks. Rank up the leaderboards, do daily challenges and become an ASLinguist today!",
    image: aslingo,
    tags: ["Python", "JavaScript", "React", "OpenCV", "MediaPipe", "NumPy", "FastAPI"],
    link: "https://devpost.com/software/aslingo-ah0web",
  },
  {
    title: "Portfolio Website",
    category: "Creative Portfolio",
    description:
      "You're looking at it! This portfolio was built with a focus on performance, visual polish and a seamless experience. It features a custom-built particle collision system, interactive timeline and smooth animations throughout.",
    image: portfolioWebsite,
    tags: ["TypeScript", "Three.js", "React", "Node.js", "Tailwind CSS"],
    link: "https://abi.gg",
  },
];

const capabilities = [
  "Full-stack architecture",
  "Scalable systems & infrastructure",
  "Product & UX design",
  "AI & ML integration",
  "High-performance engineering",
  "Technical leadership & communication",
];

const Index = () => {
  const [openForm, setOpenForm] = useState(false);
  const [activeExp, setActiveExp] = useState<(typeof experience)[0] | null>(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [simulationMode, setSimulationMode] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { toast } = useToast();

  useEffect(() => {
    const sections = ["hero", "about", "experience", "work", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.4
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleExperiencesClick = () => {
    const experienceSection = document.getElementById("experience");
    if (experienceSection) {
      window.scrollTo({top: experienceSection.offsetTop, behavior: "smooth" });
    }
  } 

  const handleWorkClick = () => {
    const workSection = document.getElementById("work");
    if (workSection) {
      window.scrollTo({top: workSection.offsetTop, behavior: "smooth" });
    }
  }

  const handleDiscussClick = (subject: string | null) => {
    setMessage(subject ? subject : "");
    setOpenForm(true);
    
    requestAnimationFrame(() => {
      const contact = document.getElementById("contact");
      if (contact) {
        contact.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleCollision simulationMode={simulationMode} />
      </div>

      <div
        className={`
          relative z-10 transition-all duration-200 ease-in-out
          ${simulationMode ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <Navbar activeSection={activeSection} />
        <main className="relative z-10">
          {/* Hero */}
          <section id="hero" className="flex min-h-[100svh] flex-col items-center justify-center px-4 text-center md:min-h-screen md:px-6">          
            <div
              className="surface-panel max-w-3xl px-6 py-8 sm:px-8 sm:py-10 md:px-14 md:py-12 mt-10 md:mt-16 border-dynamic"            
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width; // 0 → 1
                e.currentTarget.style.setProperty('--x', `${x * 100}%`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--x', `50%`);
              }}
            >
              <h1 className="text-gradient text-4xl font-semibold tracking-[-0.06em] sm:text-5xl md:text-6xl lg:text-8xl">
                Abishanan Sriranjan
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                Software engineer building high-scale systems and performance-critical applications.
              </p>

              {/* Link Chip Buttons */}
              <div className="mt-8 flex justify-center gap-4">
                {/* LinkedIn */}
                <LinkChip href="https://linkedin.com/in/abishanan-sriran" >
                  <FaLinkedin className="h-6 w-6" />
                </LinkChip>

                {/* GitHub */}
                <LinkChip href="https://github.com/AbishananSriran">
                  <FaGithub className="h-6 w-6" />
                </LinkChip>

                {/* Email */}
                <HoverButton
                  onClick={() => handleDiscussClick(null)}
                  ariaLabel="Email"
                >
                  <Mail className="h-6 w-6" />
                </HoverButton>
              </div>
            </div>
          </section>

          {/* Spacer — scroll through the particle collision */}
          <div className="h-[120vh]" />

          {/* About */}
          <section id="about" className="flex justify-center px-4 pb-10 md:px-6 md:pb-16">
            <div className="w-full max-w-6xl border-t border-border/40 pt-20 md:pt-24">
              <div className="surface-panel p-8 md:p-10 lg:p-12">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_280px] lg:items-start">
                  <div>
                    <p className="eyebrow-label mb-5">About</p>
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl md:text-5xl">
                      <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Building solutions
                      </span>{" "}
                      that are reliable, scalable and engineered with precision.
                    </h2>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                      My work sits between{" "}
                      <span className="text-cyan-200/90">engineering</span> and{" "}
                      <span className="text-fuchsia-200/90">product thinking</span>. I care about rhythm,
                      restraint and the small details that make software feel{" "}
                      <span className="text-foreground font-medium">premium</span>.
                    </p>

                    <div className="mt-8 rounded-[1.5rem] border border-border/30 bg-secondary/60 p-6">
                      <p className="eyebrow-label mb-4">Skills</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {capabilities.map((item) => (
                          <li
                            key={item}
                            className="border-b border-border/25 pb-3 text-sm text-foreground last:border-b-0 last:pb-0 md:text-base"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <HoverButton 
                        onClick={handleExperiencesClick}
                        ariaLabel="View experience"
                      >
                        View experience
                        <ArrowUpRight className="h-4 w-4" />
                      </HoverButton>

                      <HoverButton 
                      onClick={handleWorkClick}
                      ariaLabel="Explore my work"
                      >
                        Explore my work
                        <ArrowUpRight className="h-4 w-4" />
                      </HoverButton>
                      
                      <HoverButton 
                        onClick={() => handleDiscussClick(null)}
                        ariaLabel="Start a conversation"
                      >
                        Start a conversation
                        <ArrowUpRight className="h-4 w-4" />
                      </HoverButton>
                    </div>
                  </div>

                  <div className="image-frame w-full h-full justify-self-center lg:justify-self-end order-first lg:order-last">
                    <img
                      src={aboutPortrait}
                      alt="Portrait of Abishanan Sriranjan"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={560}
                      height={560}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="flex justify-center px-4 pb-10 md:px-6 md:pb-16">
            <div className="w-full max-w-6xl border-t border-border/40 pt-20 md:pt-24">

              {/* Header */}
              <div className="mb-10 flex flex-col gap-5 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="eyebrow-label mb-4">Experience</p>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                    A track record of launching and scaling systems that{" "}
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                      deliver real results
                    </span>.
                  </h2>
                </div>
              </div>

              <div className="relative isolate">
                <div className="surface-panel p-6 md:p-8">
                  <div className="relative">

                    {/* vertical timeline line */}
                    <div className="absolute left-[54px] sm:left-[64px] top-0 bottom-0 w-px bg-border/30 bg-white/15" />

                    <div className="space-y-8">
                      {experience.map((item) => (
                        <div key={item.title} className="group grid grid-cols-[40px_1fr] sm:grid-cols-[50px_1fr] gap-4">

                          {/* YEAR */}
                          <div className="text-[11px] text-muted-foreground/60 pt-5 sm:pt-7">
                            {item.year}
                          </div>

                          {/* CONTENT */}
                          <div className="relative pl-6 sm:pl-8">

                            {/* timeline dot */}
                            <div className="absolute left-[-6px] top-8 h-2.5 w-2.5 rounded-full bg-white/70" />

                            <button
                              onClick={() => setActiveExp(item)}
                              className="w-full text-left p-4 rounded-lg transition-all duration-200 group focus:outline-none gradient-border-pseudo"
                            >
                              <div className="flex items-start gap-3 pr-3">

                                {/* LOGO */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-background/60">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-6 w-6 object-contain opacity-70 grayscale transition group-hover:grayscale-0 group-hover:opacity-100"
                                  />
                                </div>

                                {/* TEXT */}
                                <div className="flex-1">

                                  {/* top row */}
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                                    <div>
                                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                                        {item.title}
                                      </h3>
                                      <div className="text-[11px] text-muted-foreground leading-tight pt-1 flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2">
                                        <span>{item.subtitle}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{item.location}</span>
                                      </div>
                                    </div>

                                    <span className="text-[11px] text-muted-foreground/60 whitespace-nowrap">
                                      {item.date}
                                    </span>
                                  </div>

                                  {/* description */}
                                  <p className="my-2 max-w-md text-[12px] leading-5 text-muted-foreground">
                                    {item.description}
                                  </p>

                                  {/* tags */}
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {item.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="rounded-full border border-border/30 px-2 py-0.5 text-[10px] text-muted-foreground"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Work */}
          <section id="work" className="flex justify-center px-4 pb-10 md:px-6 md:pb-16">
            <div className="w-full max-w-6xl border-t border-border/40 pt-20 md:pt-24">
              <div className="mb-10 flex flex-col gap-5 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="eyebrow-label mb-4">Work</p>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                    Selected creations{" "}
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                      carefully crafted
                    </span>{" "}
                    with{" "}
                    <span className="text-cyan-200/90">systems thinking</span>{" "}
                    and{" "}
                    <span className="text-fuchsia-200/90">visual restraint</span>.
                  </h2>
                </div>
                <div className="w-fit">
                  <HoverButton 
                    onClick={() => handleDiscussClick("I'm interested in discussing a project with you!")} 
                    ariaLabel="Discuss a project"
                  >
                    Discuss a project
                    <ArrowUpRight className="h-4 w-4" />
                  </HoverButton>
                </div>
              </div>

              <div className="surface-panel p-8 md:p-10 lg:p-12">
                <div className="space-y-10">
                  {featuredProjects.map((project) => (
                    <article
                      key={project.title}
                      className="grid gap-6 grid-cols-1 border-b border-border/30 pb-10 last:pb-0 last:border-none md:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
                    >
                      {/* Image */}
                      <div className="image-frame w-full max-w-[180px] sm:max-w-[220px] md:max-w-[240px]">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between gap-6">
                        <div>
                          <p className="eyebrow-label mb-2">{project.category}</p>

                          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
                            {project.title}
                          </h3>

                          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/30 px-3 py-1 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Link */}
                          <LinkChip
                            href={project.link}
                            className="flex items-center gap-1"
                          >
                            Project link
                            <ArrowUpRight className="h-4 w-4" />
                          </LinkChip>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            className="flex justify-center px-4 pb-10 md:px-6 md:pb-12"
          >
            <div className="w-full max-w-6xl border-t border-border/40 pt-10 md:pt-12">
              <div className="surface-panel mx-auto max-w-3xl p-8 text-center md:p-10">
                <p className="eyebrow-label mb-4">Contact</p>

                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                  Let's build{" "}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                    high-impact products
                  </span>{" "}
                  that matter.
                </h2>

                <p className="mx-auto mt-4 mb-2 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                  Open to{" "}
                  <span className="text-cyan-200/90">software projects</span>{" "}
                  and{" "}
                  <span className="text-fuchsia-200/90">design-driven collaborations</span>.
                </p>

                {!openForm ? (
                  <div className="flex flex-col sm:flex-row pt-6 justify-center items-center gap-3 sm:gap-2 text-sm text-muted-foreground">
                    <HoverButton
                      onClick={() => handleDiscussClick("")}
                      ariaLabel="Start a conversation"
                    >
                      Start a conversation
                    </HoverButton>

                    <span className="opacity-60">- or -</span>

                    <LinkChip 
                    href="mailto:contact@abi.gg"
                    >
                      contact@abi.gg
                      <Mail className="h-4 w-4" />
                    </LinkChip>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);

                      const name = formData.get("name")?.toString() || "";
                      const email = formData.get("email")?.toString() || "";

                      try {
                        if (!name){
                          toast({
                            title: "Info",
                            description: "Please enter your name.",
                            variant: "info",
                          });
                          return;
                        } else if (!email || !email.match(EMAIL_REGEX)) {
                          toast({
                            title: "Info",
                            description: "Please enter a valid email.",
                            variant: "info",
                          });
                          return;
                        } else if (!message) {
                          toast({
                            title: "Info",
                            description: "Please enter a message.",
                            variant: "info",
                          });
                          return;
                        }

                        const token = await recaptchaRef.current?.getValue();

                        if (!token) {
                          toast({
                            title: "Info",
                            description: "Please complete the captcha.",
                            variant: "info",
                          });
                          return;
                        }

                        const res = await fetch(`${API_URL}/api/contact`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name,
                            email,
                            message,
                            recaptchaToken: token,
                          }),
                        });

                        const data = await res.json();

                        if (res.ok) {
                          toast({
                            title: "Success",
                            description: "Email sent successfully!",
                            variant: "success",
                          });
                          setOpenForm(false);
                          setMessage("");
                          form.reset();
                          recaptchaRef.current?.reset();
                        } else {
                          toast({
                            title: "Error",
                            description: data.error || "Failed to send message",
                            variant: "destructive",
                          });
                        }
                      } catch (err) {
                        console.error(err);
                        alert("An unexpected error occurred");
                      }
                    }}
                  >
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-lg border border-border/30 bg-background/60 px-4 py-3 text-sm outline-none focus:border-foreground/40"
                    />

                    <input
                      name="email"
                      type="text"
                      placeholder="Your email"
                      className="w-full rounded-lg border border-border/30 bg-background/60 px-4 py-3 text-sm outline-none focus:border-foreground/40"
                    />

                    <textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      rows={4}
                      className="w-full rounded-lg border border-border/30 bg-background/60 px-4 py-3 text-sm outline-none focus:border-foreground/40"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />

                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      theme="dark"
                      className="mt-2 mb-4 ml-1"
                    />

                    <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                      <HoverButton 
                        onClick={() => {}} 
                        type="submit"
                        className="flex items-center gap-1"
                        ariaLabel="Send message"
                      >
                        Send message
                      </HoverButton>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenForm(false);
                          setMessage("");
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative flex justify-center px-4 md:px-6 mt-12">
            <div className="w-full max-w-6xl rounded-2xl border border-border/30 bg-background/70 backdrop-blur-xl px-6 py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-sm text-muted-foreground"> 
                {/* Left */} 
                <div className="text-xs text-muted-foreground text-center md:text-left">
                  © {new Date().getFullYear()} Abishanan Sriranjan. All rights reserved. 
                </div> 

                {/* Center */} 
                <div className="flex justify-center">
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md transition-all hover:text-foreground hover:bg-white/5" 
                  > 
                    Back to top 
                    <LucideArrowUp className="h-4 w-4" /> 
                  </button> 
                </div> 
                
                {/* Right */} 
                <div className="flex justify-center md:justify-end text-foreground"> 
                  <span className="font-medium">Toronto, Canada 🇨🇦</span> 
                </div> 
              </div>
            </div> 
          </footer>

          <AnimatePresence>
            {activeExp && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg px-4"
                onClick={() => setActiveExp(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <motion.div
                  className="surface-panel max-w-lg w-full p-8 md:p-10"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <p className="eyebrow-label mb-3">{activeExp.subtitle}</p>

                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {activeExp.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {activeExp.fullDescription}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeExp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/30 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                    
                  <div className="mt-8 flex justify-between gap-3">
                    {activeExp.caseStudy && (
                      <LinkChip
                        href={activeExp.caseStudy}
                      >
                        Case Study
                        <ArrowUpRight className="h-4 w-4" />
                      </LinkChip>
                    )}
                    <HoverButton
                      onClick={() => setActiveExp(null)}
                      ariaLabel="Close experience details"
                    >
                      Close
                    </HoverButton>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <ChatWidget />
      </div>

      <SimulationMode simulationMode={simulationMode} setSimulationMode={setSimulationMode} />
    </div>
  );
};

export default Index;
