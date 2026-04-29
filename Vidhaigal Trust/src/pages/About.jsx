import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import teamRamesh from '../assets/team_ramesh.png';
import teamPriya from '../assets/team_priya.png';
import teamSuresh from '../assets/team_suresh.png';
import teamAnita from '../assets/team_anita.png';
const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('nav.about')} | Vidhaigal Trust</title>
        <meta name="description" content="Learn about our story, mission, and the team behind Vidhaigal Trust." />
      </Helmet>

      <main role="main" className="pt-24 pb-20">
        {/* Page Header */}
        <section className="bg-primary py-20 text-center text-white">
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold mb-4"
            >
              {t('nav.about')}
            </motion.h1>
            <p className="text-xl max-w-2xl mx-auto text-light-green">
              Discover our roots, our mission, and the impact we strive to make every single day.
            </p>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Our Mission', desc: 'To plant the seeds of change, foster growth, and make a lasting community impact.', color: 'bg-light-green text-primary' },
                { title: 'Our Vision', desc: 'A world where every small act of kindness grows into a forest of opportunities for all.', color: 'bg-secondary text-text-dark' },
                { title: 'Our Values', desc: 'Integrity, Compassion, Sustainability, and Community Empowerment.', color: 'bg-primary text-white' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 rounded-2xl shadow-lg ${item.color}`}
                >
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-lg opacity-90">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-20 bg-beige">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-text-dark mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 1, name: "Ramesh K.", role: "Founder & Director", image: teamRamesh },
                { id: 2, name: "Priya M.", role: "Head of Operations", image: teamPriya },
                { id: 3, name: "Suresh S.", role: "Project Manager", image: teamSuresh },
                { id: 4, name: "Anita R.", role: "Community Outreach", image: teamAnita }
              ].map((member) => (
                <div key={member.id} className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-4 h-80">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-text-dark">{member.name}</h4>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
