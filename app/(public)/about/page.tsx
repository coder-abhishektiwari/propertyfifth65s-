import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Property Fifth",
  description:
    "Learn about Property Fifth — a specialised real estate advisory firm dedicated to Defence and Paramilitary personnel and their families.",
};

const WHY_US = [
  {
    num: "01",
    title: "Exclusive Focus",
    desc: "We work exclusively with Defence and Paramilitary personnel, allowing our advisory approach to remain closely aligned with their requirements.",
  },
  {
    num: "02",
    title: "Luxury Portfolio",
    desc: "We curate premium and luxury projects with attention to quality, location, lifestyle, developer credentials and long-term considerations.",
  },
  {
    num: "03",
    title: "Trusted Guidance",
    desc: "We bring a professional, transparent and personalised approach to every stage of the property journey.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero — Unchanged as requested */}
      <section className="relative bg-primary overflow-hidden mt-16 lg:mt-18">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[480px]">
          <div className="relative z-10 w-full lg:w-1/2 flex items-center">
            <div className="container-site py-12 lg:py-20">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-inverse leading-tight mb-6">
                About<span className="text-accent"> Us</span>
              </h1>
              <div className="w-16 h-[3px] bg-accent mb-8" />
              <p className="text-inverse-muted text-base leading-relaxed max-w-md">
                We are a premium real estate advisory firm committed to helping you make confident property decisions that shape your future.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-4/5 min-h-[300px] lg:min-h-auto">
            <Image
              src="/images/hero/who-we-are.png"
              alt="Property Fifth Premium Lounge"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/1 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary lg:hidden" />
          </div>
        </div>
      </section>

      {/* Intro — About Property Fifth */}
      <section className="bg-card py-[65px] lg:py-[90px] px-[7%] lg:px-[8%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[35px] lg:gap-[70px] items-center">
          <div>
            <p className="uppercase tracking-[4px] text-[13px] font-bold text-accent-strong mb-[22px]">
              About Property Fifth
            </p>
            <h2 className="font-serif text-[38px] lg:text-[46px] leading-[1.15] font-normal text-primary mb-[22px]">
              Real Estate Advisory With a Purpose.
            </h2>
            <div className="space-y-[18px] text-[18px] text-muted-foreground leading-[1.6]">
              <p>
                Property Fifth is a specialised real estate advisory firm dedicated to helping Defence and Paramilitary personnel and their families discover exceptional luxury and premium properties.
              </p>
              <p>
                Our approach is built around understanding our clients—not simply selling them a property. From carefully curated projects to personalised guidance, we aim to make every property decision clear, informed and seamless.
              </p>
            </div>
          </div>
          <div>
            <div className="border-l-[3px] border-gold-light pl-[30px] py-[25px]">
              <p className="font-serif text-[23px] lg:text-[27px] text-primary leading-snug">
                “A property is more than an address. It is a decision about your family, your future and your legacy.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Property Fifth — Dark Cards */}
      <section className="bg-navy text-inverse py-[65px] lg:py-[90px] px-[7%] lg:px-[8%]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-[720px] mb-[55px]">
            <p className="uppercase tracking-[4px] text-[13px] font-bold text-gold-light mb-[22px]">
              Why Property Fifth
            </p>
            <h2 className="font-serif text-[38px] lg:text-[46px] leading-[1.15] font-normal mb-[22px]">
              A Different Kind of Real Estate Experience.
            </h2>
            <p className="text-[17px] text-inverse-muted leading-[1.6]">
              Our exclusive focus allows us to bring together luxury real estate, specialised understanding and a service culture shaped by years of working with the Defence and Law Enforcement ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
            {WHY_US.map((item) => (
              <div
                key={item.num}
                className=" p-[38px_30px] min-h-[260px] bg-card/[0.025]"
              >
                <p className="text-gold-light text-[13px] tracking-[3px] font-bold">
                  {item.num}
                </p>
                <h3 className="font-serif text-[28px] font-normal text-inverse mt-[18px] mb-[12px]">
                  {item.title}
                </h3>
                <p className="text-inverse-muted leading-[1.6]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Foundation — DSS Solutions */}
      <section className="bg-accent-soft py-[65px] lg:py-[90px] px-[7%] lg:px-[8%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[35px] lg:gap-[70px] items-center">
          <div>
            <p className="uppercase tracking-[4px] text-[13px] font-bold text-accent-strong mb-[22px]">
              Our Foundation
            </p>
            <h2 className="font-serif text-[38px] lg:text-[46px] leading-[1.15] font-normal text-primary mb-[22px]">
              Backed by a Decade of Defence-Sector Experience.
            </h2>
            <p className="text-[18px] text-muted-foreground leading-[1.6]">
              Property Fifth is led by an{" "}
              <span className="text-accent-strong font-bold">Ex-Army Officer</span>{" "}
              and is a sister concern of DSS Solutions.
            </p>
          </div>

          <div>
            <div className="bg-card p-[48px] shadow-lg">
              <h3 className="font-serif text-[34px] font-normal text-primary mb-[15px]">
                DSS Solutions
              </h3>
              <div className="space-y-[16px] text-muted-foreground leading-[1.6]">
                <p>
                  For over a decade, DSS Solutions has worked with organisations and professionals across the{" "}
                  <span className="text-accent-strong font-bold">Defence and Law Enforcement sectors</span>, providing technology and IT solutions tailored to their operational requirements.
                </p>
                <p>
                  This long-standing association gives Property Fifth a strong understanding of the community we serve and reinforces the values at the heart of our approach:{" "}
                  <strong className="text-primary">trust, discipline, confidentiality, professionalism and service.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-card py-[65px] lg:py-[90px] px-[7%] lg:px-[8%]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-[35px] lg:gap-[70px] items-center">
          <div>
            <div className="border-l-[3px] border-gold-light pl-[30px] py-[25px]">
              <p className="font-serif text-[23px] lg:text-[27px] text-primary leading-snug">
                Curated properties. Personalised advice. A relationship built on trust.
              </p>
            </div>
          </div>
          <div>
            <p className="uppercase tracking-[4px] text-[13px] font-bold text-accent-strong mb-[22px]">
              Our Vision
            </p>
            <h2 className="font-serif text-[38px] lg:text-[46px] leading-[1.15] font-normal text-primary mb-[22px]">
              Building a Trusted Luxury Real Estate Platform for the Service Community.
            </h2>
            <p className="text-[18px] text-muted-foreground leading-[1.6]">
              Our vision is to become a trusted luxury real estate advisory partner for Defence and Paramilitary personnel and their families—connecting them with exceptional properties and a level of service worthy of their trust.
            </p>
          </div>
        </div>
      </section>

    </>
  );
}