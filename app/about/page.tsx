import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Our Story - DropCast',
  description: 'Learn about the mission, values, and team behind DropCast event photography platform.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 relative overflow-hidden py-16 md:py-24 px-6">
      
      {/* Background Ornaments / Decorative Shapes */}
      <div className="bg-grid-dots w-56 h-56 opacity-[0.04] absolute top-12 left-12 pointer-events-none"></div>
      <div className="bg-grid-dots w-64 h-64 opacity-[0.04] absolute bottom-24 right-12 pointer-events-none"></div>
      
      {/* Ambient Radial Glows */}
      <div className="w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-3xl absolute -top-40 -left-20 -z-10 pointer-events-none"></div>
      <div className="w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl absolute top-1/3 -right-40 -z-10 pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl absolute -bottom-20 left-1/4 -z-10 pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
        
        {/* 1. HERO BLOCK */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Our Journey</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            We capture the moments <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              that connect us.
            </span>
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl leading-relaxed font-medium">
            DropCast was born out of a simple problem: why is it so hard to get photos from the events we attend? We set out to build the simplest, most collaborative way to aggregate memories.
          </p>
        </section>

        {/* 2. STATS / METRICS DASHBOARD */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1.2M+', label: 'Photos Shared', desc: 'Preserving precious memories' },
            { value: '250K+', label: 'Events Hosted', desc: 'From birthdays to festivals' },
            { value: '99.9%', label: 'Uptime Delivery', desc: 'Instant upload reliability' },
            { value: '4.9★', label: 'Guest Rating', desc: 'Seamless upload experience' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-indigo-150/80 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-xl hover:-translate-y-1 hover:border-brand-500/40 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-2">{stat.label}</span>
              <span className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-normal font-medium">{stat.desc}</span>
            </div>
          ))}
        </section>

        {/* 3. CORE VALUES GRID */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto font-medium">
              We guide our product design and infrastructure by three simple principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Collaborative Spontaneity',
                desc: 'Life\'s best angles are captured by the crowd. We make sharing so easy that anyone, regardless of tech-savviness, can contribute in a tap.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                )
              },
              {
                title: 'Uncompromising Privacy',
                desc: 'Your memories belong to you. No hidden tags, public feeds, or tracking algorithms. You choose exactly who joins, views, and downloads.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                )
              },
              {
                title: 'High-Fidelity Memories',
                desc: 'Photos carry emotional weight. We preserve files in high quality so that every smile, light beam, and tear remains crisp and clear.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                )
              }
            ].map((value, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-indigo-150/80 dark:border-white/10 p-8 rounded-3xl shadow-sm dark:shadow-xl hover:border-brand-500/40 hover:scale-[1.01] transition-all duration-300 group text-left space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 shadow-xs">
                  {value.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. INTERACTIVE TIMELINE / STORY */}
        <section className="space-y-16 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Timeline</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto font-medium">
              A look at how we grew from a small idea into a global photo sharing experience.
            </p>
          </div>

          <div className="relative border-l border-indigo-200 dark:border-white/10 ml-4 md:ml-32 space-y-12">
            {[
              {
                year: '2024',
                title: 'The College Spark',
                desc: 'Meeting in college and connected by a drive for building impactful software, founders Abir Dutta and Shantanu Adhikary experienced first-hand how hard it was to collect candid memories from events. Over hackathons and late-night builds, they crafted the earliest prototype.'
              },
              {
                year: '2025',
                title: 'DropCast Beta Release',
                desc: 'Abir and Shantanu formalized DropCast, removing guest sign-up barriers and engineering direct web uploads. Within months, thousands of memories were shared across college fests, weddings, and community gatherings.'
              },
              {
                year: '2026',
                title: 'Scaling Galleries & Marketplace',
                desc: 'Refining DropCast into a sleek dark glassmorphic platform with instantaneous QR code generators, real-time live displays, high-resolution media downloads, and creator marketplace bookings.'
              }
            ].map((item, i) => (
              <div key={i} className="relative pl-8 md:pl-12 group">
                {/* Connector Dot */}
                <div className="absolute -left-[6.5px] top-1.5 w-3 h-3 rounded-full border border-brand-400 bg-brand-500 group-hover:scale-125 transition-all duration-300"></div>
                
                {/* Year Label */}
                <div className="md:absolute md:-left-28 md:top-0 font-black text-brand-600 dark:text-brand-400 text-lg md:text-right md:w-20">
                  {item.year}
                </div>

                {/* Timeline Card */}
                <div className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-indigo-150/80 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-xl hover:border-brand-500/40 transition-all duration-300 text-left space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MEET THE TEAM */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Meet the Team</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto font-medium">
              Two college friends turned co-founders, building DropCast to make event memories effortless to capture and share.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-8">
            {[
              {
                name: 'Abir Dutta',
                role: 'Co-Founder & Lead Engineer',
                initials: 'AD',
                avatarBg: 'from-blue-500 to-indigo-600',
                bio: 'Met Shantanu during college. Passionate about full-stack engineering, real-time architectures, and creating seamless, high-performance digital products.',
                social: { twitter: '#', linkedin: '#', github: '#' }
              },
              {
                name: 'Shantanu Adhikary',
                role: 'Co-Founder & Product Lead',
                initials: 'SA',
                avatarBg: 'from-purple-500 to-violet-600',
                bio: 'Bonded in college over a shared vision for impactful tech. Focused on product design, developer operations, and scaling DropCast.',
                social: { twitter: '#', linkedin: '#', github: '#' }
              }
            ].map((member, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-indigo-150/80 dark:border-white/10 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-xl hover:border-brand-500/40 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
              >
                {/* Mock Avatar */}
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-extrabold text-2xl shadow-xl border-4 border-white/20 select-none group-hover:scale-105 transition-transform duration-300`}>
                  {member.initials}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">{member.name}</h3>
                  <span className="inline-block bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-semibold px-3 py-1 rounded-full">{member.role}</span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">{member.bio}</p>

                {/* Social Links Icons */}
                <div className="flex items-center space-x-4 pt-2">
                  <a href={member.social.twitter} className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="Twitter">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href={member.social.linkedin} className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={member.social.github} className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" aria-label="GitHub">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION SECTION */}
        <section className="bg-gradient-to-r from-brand-600 via-indigo-700 to-purple-800 dark:from-brand-950/80 dark:via-ink-900 dark:to-slate-950 border border-brand-500/20 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Radial visual patterns */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]"></div>
          <div className="absolute w-80 h-80 rounded-full bg-brand-500/20 blur-3xl -top-20 -left-20 pointer-events-none"></div>
          <div className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

          <div className="relative space-y-6 max-w-2xl mx-auto z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Ready to Collect Every Angle?</h2>
            <p className="text-slate-100 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Create your event in seconds. Generate your unique QR code, print or display it at your venue, and watch the memories stream in.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link 
                href="/dashboard/create" 
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-brand-700 font-bold shadow-glow hover:-translate-y-0.5 transition-all duration-200 text-sm cursor-pointer"
              >
                Create Event Now
              </Link>
              <Link 
                href="/" 
                className="px-8 py-3.5 rounded-full border border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 transition-all duration-200 text-sm cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
