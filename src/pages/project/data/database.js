import { CssLogo, HtmlLogo, JavascriptLogo } from '@/assets/images/ImagesProject';
import { GithubIcon, GlobeIcon } from 'lucide-react';

export const ProjectData = {
  title: 'My Projects List',
  projects: [
    {
      category: 'Personal Projects',
      projects: [
        {
          id: 1,
          name: 'Personal project',
          description:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam aliquam quasi nostrum recusandae quod, totam est unde excepturi necessitatibus nisi sint dicta similique debitis. Eum sunt sapiente nobis itaque excepturi?',
          tools: {
            html: {
              name: 'HTML',
              logo: HtmlLogo,
            },
            css: {
              name: 'CSS',
              logo: CssLogo,
            },
            javascript: {
              name: 'Javascript',
              logo: JavascriptLogo,
            },
          },
          action: [
            {
              href: '#',
              icon: GithubIcon,
              label: 'Github',
            },
            {
              href: '#',
              icon: GlobeIcon,
              label: 'Globe',
            },
          ],
        },
        {
          id: 2,
          name: 'Destimate',
          description:
            'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam aliquam quasi nostrum recusandae quod, totam est unde excepturi necessitatibus nisi sint dicta similique debitis. Eum sunt sapiente nobis itaque excepturi?',
          tools: {
            html: {
              name: 'HTML',
              logo: HtmlLogo,
            },
            css: {
              name: 'CSS',
              logo: CssLogo,
            },
            javascript: {
              name: 'Javascript',
              logo: JavascriptLogo,
            },
          },
          action: [
            {
              href: '#',
              icon: GithubIcon,
              label: 'Github',
            },
          ],
        },
      ],
    },
    {
      category: 'Team Projects',
      projects: [
        {
          id: 1,
          name: 'Project 1',
          description: 'This is my first project',
        },
        {
          id: 2,
          name: 'Project 2',
          description: 'This is my second project',
        },
        {
          id: 3,
          name: 'Project 3',
          description: 'This is my third project',
        },
        {
          id: 4,
          name: 'Project 4',
          description: 'This is my fourth project',
        },
        {
          id: 5,
          name: 'Project 5',
          description: 'This is my fifth project',
        },
      ],
    },
  ],
};
