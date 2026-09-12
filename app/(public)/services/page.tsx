import { Metadata } from "next";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Property Fifth",
  description:
    "End-to-end real estate advisory services — property advisory, investment advisory, portfolio assistance and developer partnerships.",
};

const SERVICES = [
  {
    num: "1",
    title: "Property Advisory",
    description:
      "We help you find the right property that matches your goals, lifestyle and budget with complete transparency.",
    points: [
      "Requirement understanding",
      "Property shortlisting",
      "Market evaluation",
      "Negotiation & final selection",
    ],
    image: "/images/services/property-advisory.webp",
    reverse: false,
  },
  {
    num: "2",
    title: "Investment Advisory",
    description:
      "We identify high-potential investment opportunities backed by deep market research and data-driven insights.",
    points: [
      "Market & location research",
      "Return on investment analysis",
      "Risk assessment",
      "Investment strategy planning",
    ],
    image: "/images/services/investment-advisory.webp",
    reverse: true,
  },
  {
    num: "3",
    title: "Portfolio Assistance",
    description:
      "We help you build, optimise and grow a well-diversified real estate portfolio aligned with your goals and risk profile.",
    points: [
      "Portfolio review & analysis",
      "Asset allocation",
      "Performance optimisation",
      "Long-term portfolio growth",
    ],
    image: "/images/services/portfolio-assistance.webp",
    reverse: false,
  },
  {
    num: "4",
    title: "Developer & Channel Partnerships",
    description:
      "We partner with trusted developers and channel partners to create value-driven opportunities and build long-term relationships.",
    points: [
      "Strategic collaborations",
      "Project positioning & advisory",
      "Sales & marketing support",
      "Growth-focused partnerships",
    ],
    image: "/images/services/developer-partnerships.webp",
    reverse: true,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[var(--navy)] overflow-hidden mt-16 lg:mt-18">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[480px]">
          {/* Left Content */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-center">
            <div className="container-site py-12 lg:py-20">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Our <span className="text-[var(--gold)]">Services</span>
              </h1>
              <div className="w-16 h-[3px] bg-[var(--gold)] mb-8" />
              <p className="text-white/60 text-base leading-relaxed max-w-md">
                At Property Fifth, we provide end-to-end real estate advisory services designed to help you make the right property decisions and create long-term value.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-4/5 min-h-[300px] lg:min-h-auto">
            <Image
              src="/images/hero/our-services.webp"
              alt="Property Fifth Premium Lounge"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay from left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/1 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)] via-transparent to-[var(--navy)] lg:hidden" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-py bg-white">
        <div className="container-site">
          <div className="space-y-20 lg:space-y-28">
            {SERVICES.map((service) => (
              <div
                key={service.num}
                className={`flex flex-col ${
                  service.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                } gap-10 lg:gap-16 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/8 to-[var(--navy)]/5 rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={800}
                        height={530}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[0.65rem] font-bold tracking-[0.15em] text-[var(--gold)] uppercase bg-[var(--gold)]/10 px-3 py-1 rounded-full">
                      Service {service.num}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text)] mb-4">
                    {service.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-[var(--gold)] mb-6" />
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <ul className="space-y-4">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-[var(--gold)]" />
                        </div>
                        <span className="text-sm text-[var(--text)]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
}
