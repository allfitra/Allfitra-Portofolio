import {
  AndroidLogo,
  BootstrapLogo,
  CssLogo,
  HtmlLogo,
  JavascriptLogo,
  KotlinLogo,
  LaravelLogo,
  ReactLogo,
  TailwindLogo,
  PythonLogo,
  SeleniumLogo,
} from '@/assets/images/ImagesProject';
import { GithubIcon, GlobeIcon } from 'lucide-react';

export const ProjectData = {
  title: 'My Projects List',
  projects: [
    {
      category: 'Personal Projects',
      projects: [
        {
          id: 1,
          name: 'AiVents (Portal Event Information)',
          description:
            'A website that displays event information in the Jakarta area. Here users can find out information about events that are taking place or will take place so that they can organize plans to visit the event.',
          tools: {
            react: { name: 'React', logo: ReactLogo },
            tailwind: { name: 'tailwind', logo: TailwindLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            { href: 'https://github.com/allfitra/aiVents', icon: GithubIcon, label: 'Github' },
            { href: 'https://ai-vents.vercel.app/', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 2,
          name: 'Simple Calculator',
          description:
            'Simple calculator as a means of training logic and advanced stages of learning javascript, with website functions in the form of providing convenience in performing mathematical operations.',
          tools: {
            html: { name: 'HTML', logo: HtmlLogo },
            css: { name: 'CSS', logo: CssLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            { href: 'https://github.com/allfitra/Calculator', icon: GithubIcon, label: 'Github' },
            { href: 'https://allfitra.github.io/Calculator/', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 3,
          name: 'Detik Finance Clone - Landing Page',
          description:
            'A clone website of the detik.com finance landing page, aims to train in making a suitable appearance and deepen the use of style and design for a website appearance.',
          tools: {
            html: { name: 'HTML', logo: HtmlLogo },
            css: { name: 'CSS', logo: CssLogo },
            bootstrap: { name: 'Bootstrap', logo: BootstrapLogo },
          },
          action: [
            {
              href: 'https://github.com/allfitra/Detikcom_FrontendDesignAssignment_Alfitra-Fadjri',
              icon: GithubIcon,
              label: 'Github',
            },
            {
              href: 'https://allfitra.github.io/Detikcom_FrontendDesignAssignment_Alfitra-Fadjri/',
              icon: GlobeIcon,
              label: 'Globe',
            },
          ],
        },
        {
          id: 4,
          name: 'Personal Portofolio',
          description:
            'A website that aims to display personal biodata, as well as a showcase for skills and expertise that is made as attractive as possible so that it is easy to access and use.',
          tools: {
            react: { name: 'React', logo: ReactLogo },
            tailwind: { name: 'tailwind', logo: TailwindLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            { href: 'https://github.com/allfitra/Portofolio', icon: GithubIcon, label: 'Github' },
            { href: '/', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 5,
          name: 'YouTube Scrapping - Python',
          description:
            'Scraping Youtube id, url, and youtube comment from videos using the BeautifulSoup library and Selenium Driver library in Python.',
          tools: {
            python: { name: 'Python', logo: PythonLogo },
            selenium: { name: 'Selenium', logo: SeleniumLogo },
          },
          action: [
            {
              href: 'https://github.com/allfitra/YouTube-Scraping-python',
              icon: GithubIcon,
              label: 'Github',
            },
          ],
        },
        {
          id: 6,
          name: 'Convolutional Neural Network (CNN) Model - Self-Developed in Python',
          description:
            'Implementing a Convolutional Neural Network (CNN) from scratch in Python without utilizing standard machine learning libraries such as TensorFlow or PyTorch, to understand the underlying principles of CNNs.',
          tools: {
            python: { name: 'Python', logo: PythonLogo },
          },
          action: [
            {
              href: 'https://github.com/allfitra/CNN_Model-Python',
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
          name: 'Destimate - Landing Page',
          description:
            'A platform for travelers to implement carbon emission usage transparency features for each user-selected destination trip, this website serves as a bridge for users between the Destimate basic website and mobile app.',
          tools: {
            react: { name: 'React', logo: ReactLogo },
            tailwind: { name: 'tailwind', logo: TailwindLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            {
              href: 'https://github.com/Capstone-Tim-02/sustain-tour-frontend-landing-page',
              icon: GithubIcon,
              label: 'Github',
            },
            { href: 'https://destimate.netlify.app/', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 2,
          name: 'Destimate - CMS',
          description:
            'The CMS Destimate is a web application designed to effectively manage content for the Destimate mobile application and serves as a centralized platform for organizing and updating related to tours and user account settings.',
          tools: {
            react: { name: 'React', logo: ReactLogo },
            tailwind: { name: 'tailwind', logo: TailwindLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            {
              href: 'https://github.com/Capstone-Tim-02/sustain-tour-frontend-cms',
              icon: GithubIcon,
              label: 'Github',
            },
            { href: 'https://cms-destimate.netlify.app/login', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 3,
          name: 'Ketemu Enak',
          description:
            'KetemuEnak-FE is a website that aims to be an exciting culinary event discovery platform designed to connect food enthusiasts, event organizers, and local businesses in Greater Jakarta.',
          tools: {
            react: { name: 'React', logo: ReactLogo },
            tailwind: { name: 'tailwind', logo: TailwindLogo },
            javascript: { name: 'Javascript', logo: JavascriptLogo },
          },
          action: [
            {
              href: 'https://github.com/KetemuEnak/KetemuEnak-FE',
              icon: GithubIcon,
              label: 'Github',
            },
            { href: 'https://ketemu-enak.vercel.app/', icon: GlobeIcon, label: 'Globe' },
          ],
        },
        {
          id: 4,
          name: 'Open Desa',
          description:
            'A mobile application that helps provide information related to villages in Indonesia with features in the form of a means of connecting and information containers for village communities.',
          tools: {
            android: { name: 'android', logo: AndroidLogo },
            kotlin: { name: 'kotlin', logo: KotlinLogo },
          },
          action: [
            {
              href: 'https://github.com/allfitra/OpenDesaProject',
              icon: GithubIcon,
              label: 'Github',
            },
          ],
        },
        {
          id: 5,
          name: 'Kueku - Website',
          description:
            'An e-commerce website dedicated to the sale of cakes both privately and in partnership with cake merchants.',
          tools: {
            laravel: { name: 'laravel', logo: LaravelLogo },
            bootstrap: { name: 'bootstrap', logo: BootstrapLogo },
          },
          action: [
            {
              href: 'https://github.com/allfitra/Kueku-Website',
              icon: GithubIcon,
              label: 'Github',
            },
          ],
        },
      ],
    },
  ],
};
