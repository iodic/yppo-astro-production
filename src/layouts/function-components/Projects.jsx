import { humanize } from "@/lib/utils/textConverter";
import * as Icon from "react-feather";

const Projects = ({ projects }) => {
  return (
    <div className="col-12">
      <div className="row">
        <div className="col-12">
          <div className="flex items-center space-x-6 rounded-lg bg-[#fafafa] px-6 py-8 mt-6">
            <div className="relative inline-flex h-24 w-24 items-center justify-center p-3">
              <span className="project-icon text-2xl font-semibold text-[#FA7398]">1</span>
              <svg className="absolute left-0 top-0 h-full w-full" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M42.8833 0.00928958C63.2143 -0.38584 82.2759 11.853 88.3264 31.1979C94.1797 49.9121 84.027 68.9907 68.0244 80.3913C52.4387 91.4948 31.5679 93.9094 16.0849 82.6642C0.66775 71.4667 -3.27813 50.9537 2.58684 32.8642C8.48561 14.6704 23.699 0.382132 42.8833 0.00928958Z" fill="#FFCC99"></path>
              </svg>
            </div>
            <div>
              <h3 className="h5 font-primary">Supervisory relationship</h3>
              <p className="mt-4">Encourage frequent & timely recognition integrating with communication tools</p>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="flex items-center space-x-6 rounded-lg bg-[#fafafa] px-6 py-8 lg:mt-6">
            <div className="relative inline-flex h-24 w-24 items-center justify-center p-3">
              <span className="project-icon text-2xl font-semibold text-[#FA7398]">2</span>
              <svg className="absolute left-0 top-0 h-full w-full" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M42.8833 0.00928958C63.2143 -0.38584 82.2759 11.853 88.3264 31.1979C94.1797 49.9121 84.027 68.9907 68.0244 80.3913C52.4387 91.4948 31.5679 93.9094 16.0849 82.6642C0.66775 71.4667 -3.27813 50.9537 2.58684 32.8642C8.48561 14.6704 23.699 0.382132 42.8833 0.00928958Z" fill="#FFCC99"></path>
              </svg>
            </div>
            <div>
              <h3 className="h5 font-primary">Performance evaluation</h3>
              <p className="mt-4">Encourage frequent & timely recognition integrating with communication tools</p>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="flex items-center space-x-6 rounded-lg bg-[#fafafa] px-6 py-8 lg:mt-6">
            <div className="relative inline-flex h-24 w-24 items-center justify-center p-3">
              <span className="project-icon text-2xl font-semibold text-[#FA7398]">3</span>
              <svg className="absolute left-0 top-0 h-full w-full" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M42.8833 0.00928958C63.2143 -0.38584 82.2759 11.853 88.3264 31.1979C94.1797 49.9121 84.027 68.9907 68.0244 80.3913C52.4387 91.4948 31.5679 93.9094 16.0849 82.6642C0.66775 71.4667 -3.27813 50.9537 2.58684 32.8642C8.48561 14.6704 23.699 0.382132 42.8833 0.00928958Z" fill="#FFCC99"></path>
              </svg>
            </div>
            <div>
              <h3 className="h5 font-primary">Sexual Harassment</h3>
              <p className="mt-4">Encourage frequent & timely recognition integrating with communication tools</p>

              <ol className="subitems list-decimal list-outside pl-5 mb-3">
                <li>
                  <a className="toggle" href="#">Excessive nonverbal attention by someone you know</a>

                  <ol className="subitems list-decimal list-outside pl-5">
                    <li><a className="text-[#f3873c]" href="/wiki-sh-nonverbal-intro">Intro</a></li>
                    <li>Why it's so difficult</li>
                    <li>Options you have to deal more effectively with the situation</li>
                    <li><a href="#">Bringing in a third party</a></li>
                    <li><a href="#">Additional resources</a></li>
                  </ol>
                </li>
                <li><a href="#">Inappropriate verbal comment</a></li>
                <li><a href="#">Inappropriate written messages</a></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="flex items-center space-x-6 rounded-lg bg-[#fafafa] px-6 py-8 lg:mt-6">
            <div className="relative inline-flex h-24 w-24 items-center justify-center p-3">
              <span className="project-icon text-2xl font-semibold text-[#FA7398]">4</span>
              <svg className="absolute left-0 top-0 h-full w-full" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.1" fillRule="evenodd" clipRule="evenodd" d="M42.8833 0.00928958C63.2143 -0.38584 82.2759 11.853 88.3264 31.1979C94.1797 49.9121 84.027 68.9907 68.0244 80.3913C52.4387 91.4948 31.5679 93.9094 16.0849 82.6642C0.66775 71.4667 -3.27813 50.9537 2.58684 32.8642C8.48561 14.6704 23.699 0.382132 42.8833 0.00928958Z" fill="#FFCC99"></path>
              </svg>
            </div>
            <div>
              <h3 className="h5 font-primary">Discrimination</h3>
              <p className="mt-4">Encourage frequent & timely recognition integrating with communication tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
