import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const ProjectTracker = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');

  const statuses = ['All', 'Active', 'Planning', 'Completed'];

  const projects = [
    {
      id: 1, name: "City Forest Alpha", status: "Active", progress: 65,
      startDate: "Jan 2026", targetDate: "Dec 2026", lead: "Ramesh K.",
      desc: "Creating a dense micro-forest in the heart of the city."
    },
    {
      id: 2, name: "Village Solar Setup", status: "Planning", progress: 10,
      startDate: "Jun 2026", targetDate: "Mar 2027", lead: "Priya M.",
      desc: "Installing solar panels for 50 homes in rural areas."
    },
    {
      id: 3, name: "Lake Restoration Phase 1", status: "Completed", progress: 100,
      startDate: "Jan 2025", targetDate: "Dec 2025", lead: "Suresh S.",
      desc: "Cleaned and restored the local lake, planting native flora."
    },
    {
      id: 4, name: "Digital Literacy Drive", status: "Active", progress: 40,
      startDate: "Feb 2026", targetDate: "Aug 2026", lead: "Anita R.",
      desc: "Teaching basic computer skills to senior citizens."
    },
    {
      id: 5, name: "Women Empowerment Workshop", status: "Active", progress: 55,
      startDate: "Mar 2026", targetDate: "Sep 2026", lead: "Kavitha D.",
      desc: "Vocational training for women to start micro-businesses."
    }
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-secondary text-text-dark';
      case 'Completed': return 'bg-primary text-white';
      case 'Planning': return 'bg-blue-200 text-blue-800';
      default: return 'bg-gray-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.tracker')} | Vidhaigal Trust</title>
      </Helmet>

      <main role="main" className="pt-24 pb-20 bg-beige min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-primary mb-4">Project Tracker Dashboard</h1>
            <p className="text-gray-600">Monitor the progress of our ongoing and past projects in real-time.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8 border-b pb-6">
              <span className="font-bold text-gray-700 py-2 mr-2">Filter by Status:</span>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === status ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-dark">{project.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Lead: <span className="font-medium text-gray-800">{project.lead}</span></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-6">{project.desc}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-primary">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${project.progress === 100 ? 'bg-primary' : 'bg-secondary'}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    <div><span className="font-semibold block text-gray-700">Start Date</span> {project.startDate}</div>
                    <div className="text-right"><span className="font-semibold block text-gray-700">Target Date</span> {project.targetDate}</div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No projects found for the selected status.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProjectTracker;
