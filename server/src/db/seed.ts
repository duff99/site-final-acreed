import 'dotenv/config';
import { db } from './index.js';
import { jobs, admins } from './schema.js';
import { config } from '../config.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

const seedJobs = [
  {
    id: 'omc-operations-support',
    type: 'CDI',
    location: 'Lyon',
    title: 'OMC Operations Support',
    description: 'Expertise Nokia/Huawei \u2022 T\u00e9l\u00e9coms',
    sector: 'Telecoms',
    experience: '3-5 ans',
    skills: ['Nokia NetAct', 'Huawei U2000', 'UMTS', 'LTE', 'OSS', 'Scripts bash/Python'],
    fullDescription: "Dans le cadre du d\u00e9ploiement et de l'exploitation des r\u00e9seaux mobiles de nos clients op\u00e9rateurs, nous recherchons un Technicien OMC Operations Support pour int\u00e9grer une \u00e9quipe r\u00e9seau bas\u00e9e \u00e0 Lyon.",
    responsibilities: [
      "Superviser en temps r\u00e9el les \u00e9quipements r\u00e9seau via les plateformes OMC Nokia NetAct et Huawei U2000",
      "Traiter les alarmes de niveau 1 et 2, escalader les incidents complexes aux \u00e9quipes N3",
      "R\u00e9aliser les op\u00e9rations de maintenance pr\u00e9ventive et corrective sur les n\u0153uds RAN et Core",
      "R\u00e9diger les comptes-rendus d'incidents et alimenter la base de connaissances technique",
      "Participer aux astreintes op\u00e9rationnelles selon un planning tournant",
    ],
    profile: [
      "Formation Bac+2 \u00e0 Bac+5 en t\u00e9l\u00e9communications, r\u00e9seaux ou syst\u00e8mes embarqu\u00e9s",
      "Exp\u00e9rience de 3 \u00e0 5 ans sur des environnements OMC Nokia et/ou Huawei en production",
      "Bonne ma\u00eetrise des technologies radio UMTS, LTE et des protocoles associ\u00e9s",
      "Capacit\u00e9 \u00e0 travailler en \u00e9quipe sous pression et \u00e0 g\u00e9rer les priorit\u00e9s en environnement critique",
      "Aisance avec les outils de scripting (bash, Python) pour l'automatisation des t\u00e2ches r\u00e9currentes",
    ],
    advantages: [
      "Poste au sein d'une \u00e9quipe soud\u00e9e avec un management de proximit\u00e9",
      "Acc\u00e8s \u00e0 des formations certifiantes Nokia et Huawei financ\u00e9es par l'entreprise",
      "Mutuelle d'entreprise prise en charge \u00e0 75 % et tickets restaurant",
    ],
    remote: 'Sur site',
    publishedDate: '2026-01-20',
  },
  {
    id: 'frontend-developer',
    type: 'CDI',
    location: 'Remote',
    title: 'Frontend Developer',
    description: 'Node.js, React, Blockchain \u2022 D\u00e9veloppement Web',
    sector: 'IT & Digital',
    experience: '3-5 ans',
    skills: ['React', 'TypeScript', 'Node.js', 'Web3.js', 'Solidity', 'GraphQL', 'Docker'],
    fullDescription: "Notre client, acteur majeur de la transformation digitale, recrute un D\u00e9veloppeur Frontend exp\u00e9riment\u00e9 pour renforcer son \u00e9quipe produit.",
    responsibilities: [
      "D\u00e9velopper et maintenir les interfaces utilisateur en React/TypeScript",
      "Int\u00e9grer des smart contracts Solidity via Web3.js",
      "Construire et consommer des APIs GraphQL",
      "Participer aux revues de code et aux sprints agiles",
      "Contribuer \u00e0 l'am\u00e9lioration continue des pratiques de d\u00e9veloppement",
    ],
    profile: [
      "Exp\u00e9rience de 3 \u00e0 5 ans en d\u00e9veloppement frontend React avec TypeScript",
      "Familiarit\u00e9 avec les concepts blockchain et Web3.js",
      "Ma\u00eetrise des outils modernes : Vite, Jest, Docker, CI/CD",
      "Autonomie et capacit\u00e9 \u00e0 livrer en environnement remote",
      "Bonnes capacit\u00e9s de communication en fran\u00e7ais et anglais",
    ],
    advantages: [
      "Full remote avec mat\u00e9riel fourni au choix",
      "RTT et flexibilit\u00e9 horaire",
      "Budget formation annuel de 1 500 \u20ac",
    ],
    remote: 'Full remote',
    publishedDate: '2026-01-28',
  },
  {
    id: 'telecom-project-manager',
    type: 'CDI',
    location: 'Lyon',
    title: 'Telecom Project Manager',
    description: "5+ ans d'exp\u00e9rience \u2022 Gestion de projets",
    sector: 'Telecoms',
    experience: '5+ ans',
    skills: ['Gestion de projet', 'PMP', 'PRINCE2', 'MS Project', 'R\u00e9seaux mobiles', 'RAN', 'Core Network'],
    fullDescription: "Notre client recherche un Chef de Projet T\u00e9l\u00e9com senior pour piloter des programmes de d\u00e9ploiement r\u00e9seau 4G/5G sur le territoire national.",
    responsibilities: [
      "Piloter les projets de d\u00e9ploiement et d'optimisation r\u00e9seau mobile",
      "Coordonner les \u00e9quipes internes et les sous-traitants",
      "Assurer le suivi budg\u00e9taire et les reportings d'avancement",
      "Animer les comit\u00e9s de pilotage hebdomadaires",
      "Identifier les \u00e9carts et proposer des plans d'action correctifs",
    ],
    profile: [
      "Formation ing\u00e9nieur ou Bac+5 en t\u00e9l\u00e9communications",
      "Minimum 5 ans en gestion de projets t\u00e9l\u00e9com",
      "Certification PMP ou PRINCE2 appr\u00e9ci\u00e9e",
      "Leadership naturel et aptitude \u00e0 f\u00e9d\u00e9rer des \u00e9quipes",
      "Disponibilit\u00e9 pour d\u00e9placements r\u00e9guliers en France",
    ],
    advantages: [
      "Package salarial attractif avec part variable",
      "V\u00e9hicule de fonction ou carte carburant",
      "Projets structurants \u00e0 fort impact national",
    ],
    remote: 'Hybride',
    publishedDate: '2026-02-03',
  },
  {
    id: 'ingenieur-cybersecurite',
    type: 'CDI',
    location: 'Paris',
    title: 'Ing\u00e9nieur Cybers\u00e9curit\u00e9',
    description: 'SOC, pentest, conformit\u00e9 RGPD \u2022 Cybers\u00e9curit\u00e9',
    sector: 'Cybersecurite',
    experience: '3-5 ans',
    skills: ['SIEM', 'Splunk', 'Pentest', 'ISO 27001', 'RGPD', 'Firewall', 'Zero Trust', 'Python'],
    fullDescription: "Nous recrutons un Ing\u00e9nieur Cybers\u00e9curit\u00e9 pour intervenir sur l'ensemble du p\u00e9rim\u00e8tre d\u00e9fensif : supervision du SOC, audits techniques, r\u00e9ponse aux incidents.",
    responsibilities: [
      "Analyser les alertes de s\u00e9curit\u00e9 remont\u00e9es par le SIEM (Splunk)",
      "R\u00e9aliser des tests d'intrusion sur les applications web et APIs",
      "Contribuer \u00e0 la mise en conformit\u00e9 ISO 27001",
      "Accompagner les \u00e9quipes projet en Security by Design",
      "Produire des rapports d'audit et analyses de risques",
    ],
    profile: [
      "Bac+5 en s\u00e9curit\u00e9 informatique avec 3-5 ans d'exp\u00e9rience",
      "Ma\u00eetrise des outils SIEM (Splunk, QRadar)",
      "Exp\u00e9rience en pentest applicatif et infrastructure",
      "Connaissance des normes ISO 27001 et RGPD",
      "Veille permanente sur les nouvelles menaces",
    ],
    advantages: [
      "Lab de cybers\u00e9curit\u00e9 interne pour les certifications",
      "Participation \u00e0 des conf\u00e9rences sp\u00e9cialis\u00e9es (FIC, Hack In Paris)",
      "T\u00e9l\u00e9travail 3 jours par semaine",
    ],
    remote: 'Hybride',
    publishedDate: '2026-02-05',
  },
  {
    id: 'architecte-reseau-5g',
    type: 'CDI',
    location: 'Lyon',
    title: 'Architecte R\u00e9seau 5G',
    description: 'Architecture SA/NSA, slicing r\u00e9seau \u2022 T\u00e9l\u00e9coms',
    sector: 'Telecoms',
    experience: '5+ ans',
    skills: ['5G SA', '5G NSA', 'Network Slicing', 'NFV', 'SDN', 'Kubernetes', 'OpenStack', 'Nokia', 'Ericsson'],
    fullDescription: "Nous recrutons un Architecte R\u00e9seau 5G pour piloter la conception et l'\u00e9volution du c\u0153ur de r\u00e9seau 5G Standalone.",
    responsibilities: [
      "D\u00e9finir et faire \u00e9voluer l'architecture du c\u0153ur de r\u00e9seau 5G SA",
      "R\u00e9aliser des \u00e9tudes de faisabilit\u00e9 technique et des PoC sur NFV/SDN",
      "Collaborer avec les \u00e9quipementiers Nokia et Ericsson",
      "R\u00e9diger les dossiers d'architecture et roadmaps technologiques",
      "Assurer une veille technologique sur les standards 3GPP",
    ],
    profile: [
      "Ing\u00e9nieur Bac+5 avec 5 ans en architecture r\u00e9seau mobile",
      "Expertise sur les architectures 5G SA/NSA",
      "Connaissance des plateformes cloud-native (Kubernetes, OpenStack)",
      "Ma\u00eetrise de l'anglais technique",
      "Capacit\u00e9 \u00e0 vulgariser des sujets complexes",
    ],
    advantages: [
      "R\u00f4le de r\u00e9f\u00e9rent technique avec visibilit\u00e9 forte",
      "Participation aux comit\u00e9s techniques 3GPP",
      "R\u00e9mun\u00e9ration senior avec int\u00e9ressement",
    ],
    remote: 'Hybride',
    publishedDate: '2026-02-07',
  },
  {
    id: 'devops-engineer',
    type: 'Freelance',
    location: 'Remote',
    title: 'DevOps Engineer',
    description: 'CI/CD, Kubernetes, cloud t\u00e9l\u00e9com \u2022 IT & Digital',
    sector: 'IT & Digital',
    experience: '5+ ans',
    skills: ['Kubernetes', 'Terraform', 'Ansible', 'GitLab CI', 'ArgoCD', 'Prometheus', 'Grafana', 'AWS', 'Azure'],
    fullDescription: "Mission longue dur\u00e9e (12 mois renouvelables) pour un Ing\u00e9nieur DevOps senior en freelance sur la modernisation d'infrastructure t\u00e9l\u00e9com.",
    responsibilities: [
      "Concevoir et impl\u00e9menter les pipelines CI/CD sur GitLab CI avec ArgoCD",
      "Automatiser le provisionnement cloud (AWS/Azure) via Terraform et Ansible",
      "Mettre en place la supervision (Prometheus, Grafana, alerting)",
      "Accompagner les \u00e9quipes dans l'adoption DevOps",
      "Garantir la s\u00e9curit\u00e9 et la haute disponibilit\u00e9 en production",
    ],
    profile: [
      "Minimum 5 ans en DevOps/SRE en environnement de production critique",
      "Ma\u00eetrise de Kubernetes (CKA appr\u00e9ci\u00e9e) et outils GitOps",
      "Exp\u00e9rience solide avec Terraform et cloud providers (AWS, Azure, GCP)",
      "Autonomie totale et excellente communication \u00e9crite",
      "Statut freelance requis (portage salarial accept\u00e9)",
    ],
    advantages: [
      "TJM comp\u00e9titif selon profil",
      "Mission longue dur\u00e9e sur un projet structurant",
      "Full remote avec libert\u00e9 d'organisation",
    ],
    remote: 'Full remote',
    publishedDate: '2026-02-10',
  },
];

async function seed() {
  console.log('Seeding database...');

  // Seed jobs (only if table is empty)
  const existingJobs = await db.select().from(jobs);
  if (existingJobs.length === 0) {
    const now = new Date().toISOString();
    for (const job of seedJobs) {
      await db.insert(jobs).values({
        ...job,
        createdAt: now,
        updatedAt: now,
        isActive: true,
      });
    }
    console.log(`Seeded ${seedJobs.length} jobs.`);
  } else {
    console.log(`Jobs table already has ${existingJobs.length} entries, skipping.`);
  }

  // Seed default admin from env vars (only if table is empty)
  const existingAdmins = await db.select().from(admins);
  if (existingAdmins.length === 0 && config.ADMIN_EMAIL && config.ADMIN_PASSWORD) {
    const hash = await bcrypt.hash(config.ADMIN_PASSWORD, 12);
    const now = new Date().toISOString();
    await db.insert(admins).values({
      id: nanoid(),
      email: config.ADMIN_EMAIL,
      name: config.ADMIN_NAME || 'Admin',
      passwordHash: hash,
      role: 'admin',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: null,
    });
    console.log(`Seeded admin user: ${config.ADMIN_EMAIL} (role: admin)`);
  } else if (existingAdmins.length > 0) {
    console.log(`Admins table already has ${existingAdmins.length} entries, skipping.`);
  } else {
    console.log('No ADMIN_EMAIL/ADMIN_PASSWORD set, skipping admin seed.');
  }

  console.log('Seed complete.');
}

seed().catch(console.error);
