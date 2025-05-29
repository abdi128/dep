import { Head, Link, router } from '@inertiajs/react';
import { useRef } from 'react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

// Logo
function AppLogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={props.width || 56}
      height={props.height || 68}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M100 20 L180 60 Q175 170 100 220 Q25 170 20 60 Z"
        fill="#1976d2"
        stroke="#1976d2"
        strokeWidth="8"
      />
      <path
        d="M100 40 L164 70 Q160 155 100 200 Q40 155 36 70 Z"
        fill="#fff"
      />
      <polyline
        points="55,150 85,120 105,170 125,90 155,150"
        fill="none"
        stroke="#1976d2"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="155" cy="150" r="12" fill="#1976d2" />
    </svg>
  );
}

function scrollToRef(ref: React.RefObject<HTMLElement>) {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Home() {
    const cleanup = useMobileNavigation();
    
        const handleLogout = () => {
            cleanup();
            router.flushAll();
        };
  const featuresRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f2fd] via-[#f7fbff] to-white flex flex-col">
      <Head title="Patient Tracker Application System (PTAS)" />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-md flex items-center justify-between px-8 py-4 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <AppLogoIcon width={44} height={54} />
          <span className="text-xl font-extrabold text-[#1976d2] tracking-tight">PTAS</span>
        </div>
        <ul className="flex gap-6 font-semibold text-[#15315b]">
          <li>
            <button onClick={() => scrollToRef(featuresRef)} className="hover:text-[#1976d2] transition">Features</button>
          </li>
          <li>
            <button onClick={() => scrollToRef(aboutRef)} className="hover:text-[#1976d2] transition">About</button>
          </li>
          <li>
            <button onClick={() => scrollToRef(contactRef)} className="hover:text-[#1976d2] transition">Contact</button>
          </li>
        </ul>
        <Link
          href="/continue"
          className="px-6 py-2 rounded-full bg-[#1976d2] text-white font-semibold shadow hover:bg-[#15315b] transition"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-16 gap-12 flex-1">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#15315b] mb-6 leading-tight drop-shadow">
            Patient Tracker <span className="text-[#1976d2]">Application System</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-[#1976d2] font-semibold mb-6">
            A complete, smart, and secure patient tracker platform.
          </h2>
          <p className="text-[#15315b] text-lg mb-8">
            <span className="font-semibold text-[#1976d2]">PTAS</span> unifies appointment scheduling, patient, doctor, and lab technician management, medical records, lab tests, prescriptions, billing, and payments into a seamless, modern experience.
          </p>
          <div className="flex gap-4">
            <Link
              href="/continue"
              className="inline-block px-8 py-3 rounded-full bg-[#2196f3] text-white font-semibold text-lg shadow hover:bg-[#1976d2] transition"
            >
              Get Started
            </Link>
            <button
              onClick={() => scrollToRef(featuresRef)}
              className="inline-block px-8 py-3 rounded-full bg-white text-[#1976d2] font-semibold text-lg shadow border border-[#1976d2] hover:bg-[#e3f2fd] transition"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="relative flex flex-col items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80"
            alt="Doctors and patient in hospital"
            className="rounded-3xl shadow-2xl w-80 h-64 object-cover border-4 border-white"
          />
          <img
            src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=400&q=80"
            alt="Lab technician working"
            className="rounded-3xl shadow-lg w-56 h-36 object-cover border-4 border-white -mt-8 ml-20"
          />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 md:px-16 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl mx-2 md:mx-12 -mt-12 z-20">
        <h2 className="text-4xl font-extrabold text-[#15315b] text-center mb-14 drop-shadow">Features</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#e3f2fd] to-[#ffffff] rounded-2xl p-8 shadow-xl flex flex-col items-center border-t-4 border-[#1976d2] hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
              alt="Smart Scheduling"
              className="rounded-xl w-28 h-28 object-cover mb-4 shadow"
            />
            <h3 className="text-xl font-semibold text-[#15315b] mb-2">Smart Appointment Scheduling</h3>
            <p className="text-[#15315b] text-center">
              Book, manage, and track appointments for patients, doctors, and lab technicians with ease.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#e3f2fd] to-[#ffffff] rounded-2xl p-8 shadow-xl flex flex-col items-center border-t-4 border-[#2196f3] hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80"
              alt="Medical Records"
              className="rounded-xl w-28 h-28 object-cover mb-4 shadow"
            />
            <h3 className="text-xl font-semibold text-[#15315b] mb-2">Medical Records & Management</h3>
            <p className="text-[#15315b] text-center">
              Secure access and management of all patient records, lab tests, and prescriptions.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#e3f2fd] to-[#ffffff] rounded-2xl p-8 shadow-xl flex flex-col items-center border-t-4 border-[#1976d2] hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=400&q=8"
              alt="Billing and Payments"
              className="rounded-xl w-28 h-28 object-cover mb-4 shadow"
            />
            <h3 className="text-xl font-semibold text-[#15315b] mb-2">Billing & Payments</h3>
            <p className="text-[#15315b] text-center">
              Automated billing for appointments, lab tests, and prescriptions, with clear payment tracking.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 md:px-16 bg-gradient-to-br from-[#e3f2fd] to-white">
        <h2 className="text-4xl font-extrabold text-[#15315b] text-center mb-10">About PTAS</h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-14">
          <div className="flex-1">
            <ul className="list-disc pl-6 text-[#15315b] space-y-4 text-lg">
              <li>
                <span className="font-semibold text-[#1976d2]">Streamlined management:</span> One platform for patients, doctors, and lab technicians.
              </li>
              <li>
                <span className="font-semibold text-[#1976d2]">Comprehensive records:</span> Access and manage appointments, lab tests, prescriptions, and billing in one place.
              </li>
              <li>
                <span className="font-semibold text-[#1976d2]">Role-based access:</span> Proper access control for every user type.
              </li>
              <li>
                <span className="font-semibold text-[#1976d2]">Modern, intuitive design:</span> Easy to use for all users.
              </li>
              <li>
                <span className="font-semibold text-[#1976d2]">Secure & compliant:</span> Built with privacy, security, and reliability as top priorities.
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=500&q=80"
              alt="Medical team working"
              className="rounded-3xl shadow-2xl w-96 h-72 object-cover border-4 border-[#e3f2fd]"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 px-4 md:px-16 bg-white">
        <h2 className="text-4xl font-extrabold text-[#15315b] text-center mb-10">Contact & Support</h2>
        <div className="max-w-3xl mx-auto text-center text-[#15315b] text-lg">
          <p>
            Have questions or need support? Reach out to our team at{' '}
            <a href="#" className="text-[#2196f3] underline">support@ptas.com</a>
            {' '}or use the in-app chat once you’re logged in.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-14 px-8 bg-gradient-to-r from-[#1976d2] to-[#2196f3] text-white text-center rounded-t-3xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to streamline your healthcare workflow?</h2>
        <p className="text-lg mb-6">
          Join hospitals, clinics, and professionals who trust PTAS for appointments, records, lab tests, billing, and more.
        </p>
        <Link
          href="/continue"
          className="inline-block px-10 py-4 rounded-full bg-white text-[#1976d2] font-bold text-lg shadow hover:bg-[#e3f2fd] transition"
        >
          Start Using PTAS
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-[#15315b] bg-[#e3f2fd] mt-auto">
        &copy; {new Date().getFullYear()} Patient Tracker Application System (PTAS). All rights reserved.
      </footer>
    </div>
  );
}
