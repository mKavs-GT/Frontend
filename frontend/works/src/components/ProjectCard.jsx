import React from 'react';
import { motion } from 'framer-motion';
import Tag from './Tag';

const ProjectCard = ({ project }) => {
  return (
    <motion.a 
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col-reverse md:flex-row bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      {/* Left Content - Reduced padding for half-height effect */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 group-hover:text-black transition-colors">
            {project.title}
          </h3>
          <p className="text-base md:text-lg text-gray-500 mt-2 font-light line-clamp-2">
            {project.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Tag>{project.year}</Tag>
          {project.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>

      {/* Right Image - Ultra-wide 21:9 ratio for a slimmer look */}
      <div className="w-full md:w-1/2 lg:w-[45%] overflow-hidden bg-gray-50 flex items-center">
        <div className="w-full p-2 md:p-4">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-xl md:rounded-[1.5rem]">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-[115%] max-w-none -ml-[7.5%] h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out"
            />
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
